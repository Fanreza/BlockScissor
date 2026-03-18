// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RPSGame
 * @dev Reactive Rock-Paper-Scissors game on Somnia Network
 * Supports PvP (commit-reveal) and PvBot (pseudo-random) modes
 */
contract RPSGame {
    enum Choice { None, Rock, Paper, Scissors }
    enum Phase { Open, Commit, Reveal, Finished }

    struct Game {
        address player1;
        address player2;
        bytes32 commit1;
        bytes32 commit2;
        Choice reveal1;
        Choice reveal2;
        address winner;
        Phase phase;
        uint256 stake;
        uint256 deadline;
        bool isBot;
    }

    struct BotGame3 {
        address player;
        uint8[3] playerChoices;
        uint8[3] botChoices;
        uint8[3] roundResults; // 0=draw, 1=player wins, 2=bot wins
        uint8 playerWins;
        uint8 botWins;
        address winner;
    }

    mapping(uint256 => Game) public games;
    mapping(uint256 => BotGame3) public botGames3;
    uint256 public gameCount;
    uint256 public constant TIMEOUT = 5 minutes;

    // Events
    event GameCreated(uint256 indexed gameId, address indexed player1, uint256 stake);
    event BotGameCreated(uint256 indexed gameId, address indexed player1);
    event PlayerJoined(uint256 indexed gameId, address indexed player2);
    event PlayerCommitted(uint256 indexed gameId, address indexed player, uint8 playerNum);
    event PlayerRevealed(uint256 indexed gameId, address indexed player, uint8 choice);
    event GameEnded(uint256 indexed gameId, address indexed winner, uint8 choice1, uint8 choice2);
    event GameDraw(uint256 indexed gameId, uint8 choice);
    event BotGame3Ended(uint256 indexed gameId, address indexed player, uint8 playerWins, uint8 botWins);

    modifier gameExists(uint256 gameId) {
        require(gameId < gameCount, "Game does not exist");
        _;
    }

    modifier isPlayer(uint256 gameId) {
        require(
            msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2,
            "Not a player in this game"
        );
        _;
    }

    // ===== PvP Functions =====

    function createGame() external payable {
        require(msg.value > 0, "Stake must be greater than 0");

        uint256 gameId = gameCount++;
        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            commit1: bytes32(0),
            commit2: bytes32(0),
            reveal1: Choice.None,
            reveal2: Choice.None,
            winner: address(0),
            phase: Phase.Open,
            stake: msg.value,
            deadline: 0,
            isBot: false
        });

        emit GameCreated(gameId, msg.sender, msg.value);
    }

    function joinGame(uint256 gameId) external payable gameExists(gameId) {
        Game storage game = games[gameId];
        require(game.phase == Phase.Open, "Game is not open");
        require(!game.isBot, "Cannot join bot game");
        require(msg.value == game.stake, "Stake amount must match");
        require(msg.sender != game.player1, "Cannot play against yourself");

        game.player2 = msg.sender;
        game.phase = Phase.Commit;
        game.deadline = block.timestamp + TIMEOUT;

        emit PlayerJoined(gameId, msg.sender);
    }

    function commit(uint256 gameId, bytes32 commitHash) external gameExists(gameId) isPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.phase == Phase.Commit, "Game is not in commit phase");
        require(block.timestamp <= game.deadline, "Commit deadline has passed");

        if (msg.sender == game.player1) {
            require(game.commit1 == bytes32(0), "Already committed");
            game.commit1 = commitHash;
            emit PlayerCommitted(gameId, msg.sender, 1);
        } else {
            require(game.commit2 == bytes32(0), "Already committed");
            game.commit2 = commitHash;
            emit PlayerCommitted(gameId, msg.sender, 2);
        }

        if (game.commit1 != bytes32(0) && game.commit2 != bytes32(0)) {
            game.phase = Phase.Reveal;
            game.deadline = block.timestamp + TIMEOUT;
        }
    }

    function reveal(
        uint256 gameId,
        Choice choice,
        bytes32 salt
    ) external gameExists(gameId) isPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.phase == Phase.Reveal, "Game is not in reveal phase");
        require(block.timestamp <= game.deadline, "Reveal deadline has passed");
        require(choice != Choice.None, "Invalid choice");

        bytes32 commitHash = keccak256(abi.encodePacked(uint8(choice), salt));

        if (msg.sender == game.player1) {
            require(game.reveal1 == Choice.None, "Already revealed");
            require(game.commit1 == commitHash, "Hash mismatch");
            game.reveal1 = choice;
            emit PlayerRevealed(gameId, msg.sender, uint8(choice));
        } else {
            require(game.reveal2 == Choice.None, "Already revealed");
            require(game.commit2 == commitHash, "Hash mismatch");
            game.reveal2 = choice;
            emit PlayerRevealed(gameId, msg.sender, uint8(choice));
        }

        if (game.reveal1 != Choice.None && game.reveal2 != Choice.None) {
            _resolveGame(gameId);
        }
    }

    function claimTimeout(uint256 gameId) external gameExists(gameId) {
        Game storage game = games[gameId];
        require(block.timestamp > game.deadline, "Deadline has not passed");
        require(game.phase == Phase.Commit || game.phase == Phase.Reveal, "Invalid phase");

        if (game.phase == Phase.Commit) {
            if (game.commit1 == bytes32(0) && game.commit2 != bytes32(0)) {
                game.winner = game.player2;
                (bool s, ) = game.player2.call{value: game.stake * 2}("");
                require(s, "Transfer failed");
            } else if (game.commit2 == bytes32(0) && game.commit1 != bytes32(0)) {
                game.winner = game.player1;
                (bool s, ) = game.player1.call{value: game.stake * 2}("");
                require(s, "Transfer failed");
            } else {
                (bool s1, ) = game.player1.call{value: game.stake}("");
                (bool s2, ) = game.player2.call{value: game.stake}("");
                require(s1 && s2, "Transfer failed");
            }
        } else {
            if (game.reveal1 == Choice.None && game.reveal2 != Choice.None) {
                game.winner = game.player2;
                (bool s, ) = game.player2.call{value: game.stake * 2}("");
                require(s, "Transfer failed");
            } else if (game.reveal2 == Choice.None && game.reveal1 != Choice.None) {
                game.winner = game.player1;
                (bool s, ) = game.player1.call{value: game.stake * 2}("");
                require(s, "Transfer failed");
            } else {
                (bool s1, ) = game.player1.call{value: game.stake}("");
                (bool s2, ) = game.player2.call{value: game.stake}("");
                require(s1 && s2, "Transfer failed");
            }
        }

        game.phase = Phase.Finished;
    }

    // ===== Bot Functions =====

    /**
     * @dev Play against bot in a single transaction - no commit-reveal needed
     * Bot choice is pseudo-random from block data
     */
    function playBot(Choice choice) external {
        require(choice != Choice.None, "Invalid choice");

        uint256 gameId = gameCount++;

        // Generate bot choice from pseudo-random
        uint256 rand = uint256(keccak256(abi.encodePacked(
            blockhash(block.number - 1),
            block.timestamp,
            gameId,
            msg.sender
        )));
        Choice botChoice = Choice((rand % 3) + 1);

        address winner = address(0);
        if (choice != botChoice) {
            winner = _winsOver(choice, botChoice) ? msg.sender : address(this);
        }

        games[gameId] = Game({
            player1: msg.sender,
            player2: address(this),
            commit1: bytes32(0),
            commit2: bytes32(0),
            reveal1: choice,
            reveal2: botChoice,
            winner: winner,
            phase: Phase.Finished,
            stake: 0,
            deadline: 0,
            isBot: true
        });

        emit BotGameCreated(gameId, msg.sender);

        if (choice == botChoice) {
            emit GameDraw(gameId, uint8(choice));
        } else {
            emit GameEnded(gameId, winner, uint8(choice), uint8(botChoice));
        }
    }

    /**
     * @dev Play a best-of-3 against the bot in a single transaction
     * Player submits all 3 choices upfront; bot choices are pseudo-random per round
     */
    function playBotBestOf3(uint8[3] calldata choices) external {
        // Validate all 3 choices are 1-3
        for (uint256 i = 0; i < 3; i++) {
            require(choices[i] >= 1 && choices[i] <= 3, "Invalid choice: must be 1-3");
        }

        uint256 gameId = gameCount++;

        uint8[3] memory botChoicesRaw;
        uint8[3] memory roundResults;
        uint8 playerWins = 0;
        uint8 botWins = 0;

        for (uint256 i = 0; i < 3; i++) {
            // Generate bot choice with a unique seed per round
            uint256 rand = uint256(keccak256(abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                gameId,
                msg.sender,
                i
            )));
            uint8 botChoice = uint8((rand % 3) + 1);
            botChoicesRaw[i] = botChoice;

            Choice playerChoice = Choice(choices[i]);
            Choice botChoiceEnum = Choice(botChoice);

            if (playerChoice == botChoiceEnum) {
                roundResults[i] = 0; // draw
            } else if (_winsOver(playerChoice, botChoiceEnum)) {
                roundResults[i] = 1; // player wins
                playerWins++;
            } else {
                roundResults[i] = 2; // bot wins
                botWins++;
            }
        }

        // Determine overall winner (most wins)
        address winner = address(0);
        if (playerWins > botWins) {
            winner = msg.sender;
        } else if (botWins > playerWins) {
            winner = address(this);
        }

        // Store in botGames3 mapping
        botGames3[gameId] = BotGame3({
            player: msg.sender,
            playerChoices: choices,
            botChoices: botChoicesRaw,
            roundResults: roundResults,
            playerWins: playerWins,
            botWins: botWins,
            winner: winner
        });

        // Store in games mapping (marked as bot, phase Finished)
        games[gameId] = Game({
            player1: msg.sender,
            player2: address(this),
            commit1: bytes32(0),
            commit2: bytes32(0),
            reveal1: Choice(choices[0]),
            reveal2: Choice(botChoicesRaw[0]),
            winner: winner,
            phase: Phase.Finished,
            stake: 0,
            deadline: 0,
            isBot: true
        });

        emit BotGame3Ended(gameId, msg.sender, playerWins, botWins);
    }

    // ===== View Functions =====

    function getGame(uint256 gameId) external view gameExists(gameId) returns (Game memory) {
        return games[gameId];
    }

    function getBotGame3(uint256 gameId) external view gameExists(gameId) returns (BotGame3 memory) {
        return botGames3[gameId];
    }

    // ===== Internal =====

    function _resolveGame(uint256 gameId) internal {
        Game storage game = games[gameId];
        game.phase = Phase.Finished;

        Choice c1 = game.reveal1;
        Choice c2 = game.reveal2;

        if (c1 == c2) {
            (bool s1, ) = game.player1.call{value: game.stake}("");
            (bool s2, ) = game.player2.call{value: game.stake}("");
            require(s1 && s2, "Transfer failed");
            emit GameDraw(gameId, uint8(c1));
        } else if (_winsOver(c1, c2)) {
            game.winner = game.player1;
            (bool s, ) = game.player1.call{value: game.stake * 2}("");
            require(s, "Transfer failed");
            emit GameEnded(gameId, game.player1, uint8(c1), uint8(c2));
        } else {
            game.winner = game.player2;
            (bool s, ) = game.player2.call{value: game.stake * 2}("");
            require(s, "Transfer failed");
            emit GameEnded(gameId, game.player2, uint8(c1), uint8(c2));
        }
    }

    function _winsOver(Choice a, Choice b) internal pure returns (bool) {
        return (a == Choice.Rock && b == Choice.Scissors) ||
               (a == Choice.Scissors && b == Choice.Paper) ||
               (a == Choice.Paper && b == Choice.Rock);
    }
}
