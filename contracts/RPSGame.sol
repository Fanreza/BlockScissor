// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RPSGame — Best of 3, PvP + PvBot on Somnia
contract RPSGame {
    enum Choice { None, Rock, Paper, Scissors }
    enum Phase { Open, Commit, Reveal, Finished }

    struct Game {
        address player1;
        address player2;
        bytes32 commit1;
        bytes32 commit2;
        uint8[3] choices1;
        uint8[3] choices2;
        uint8[3] roundResults; // 1=p1 win, 2=p2 win, 3=draw
        uint8 p1Wins;
        uint8 p2Wins;
        address winner;
        Phase phase;
        uint256 stake;
        uint256 deadline;
        bool isBot;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCount;
    uint256 public constant TIMEOUT = 5 minutes;

    event GameCreated(uint256 indexed gameId, address indexed player1, uint256 stake);
    event PlayerJoined(uint256 indexed gameId, address indexed player2);
    event PlayerCommitted(uint256 indexed gameId, address indexed player, uint8 playerNum);
    event PlayerRevealed(uint256 indexed gameId, address indexed player);
    event PvPGame3Ended(uint256 indexed gameId, address indexed winner, uint8 p1Wins, uint8 p2Wins);
    event BotGame3Ended(uint256 indexed gameId, address indexed player, uint8 playerWins, uint8 botWins);

    modifier gameExists(uint256 gameId) {
        require(gameId < gameCount, "Game does not exist");
        _;
    }

    // ===== PvP: Step 1 — Create Room =====

    function createRoom() external payable {
        require(msg.value > 0, "Stake required");
        uint256 gameId = gameCount++;
        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.phase = Phase.Open;
        g.stake = msg.value;
        emit GameCreated(gameId, msg.sender, msg.value);
    }

    // ===== PvP: Step 2 — Join Room =====

    function joinRoom(uint256 gameId) external payable gameExists(gameId) {
        Game storage g = games[gameId];
        require(g.phase == Phase.Open, "Not open");
        require(!g.isBot, "Bot game");
        require(msg.value == g.stake, "Stake mismatch");
        require(msg.sender != g.player1, "Cannot self-play");

        g.player2 = msg.sender;
        g.phase = Phase.Commit;
        g.deadline = block.timestamp + TIMEOUT;

        emit PlayerJoined(gameId, msg.sender);
    }

    // ===== PvP: Step 3 — Commit 3 Choices =====

    function commitChoices(uint256 gameId, bytes32 commitHash) external gameExists(gameId) {
        Game storage g = games[gameId];
        require(g.phase == Phase.Commit, "Not in commit phase");
        require(block.timestamp <= g.deadline, "Deadline passed");
        require(commitHash != bytes32(0), "Invalid hash");

        if (msg.sender == g.player1) {
            require(g.commit1 == bytes32(0), "Already committed");
            g.commit1 = commitHash;
            emit PlayerCommitted(gameId, msg.sender, 1);
        } else if (msg.sender == g.player2) {
            require(g.commit2 == bytes32(0), "Already committed");
            g.commit2 = commitHash;
            emit PlayerCommitted(gameId, msg.sender, 2);
        } else {
            revert("Not a player");
        }

        // Both committed → move to reveal
        if (g.commit1 != bytes32(0) && g.commit2 != bytes32(0)) {
            g.phase = Phase.Reveal;
            g.deadline = block.timestamp + TIMEOUT;
        }
    }

    // ===== PvP: Step 4 — Reveal 3 Choices =====

    function revealChoices(
        uint256 gameId,
        uint8[3] calldata choices,
        bytes32[3] calldata salts
    ) external gameExists(gameId) {
        Game storage g = games[gameId];
        require(g.phase == Phase.Reveal, "Not in reveal phase");
        require(block.timestamp <= g.deadline, "Deadline passed");

        for (uint256 i = 0; i < 3; i++) {
            require(choices[i] >= 1 && choices[i] <= 3, "Invalid choice");
        }

        bytes32 commitHash = keccak256(abi.encodePacked(
            choices[0], choices[1], choices[2],
            salts[0], salts[1], salts[2]
        ));

        if (msg.sender == g.player1) {
            require(g.choices1[0] == 0, "Already revealed");
            require(g.commit1 == commitHash, "Hash mismatch");
            g.choices1 = choices;
            emit PlayerRevealed(gameId, msg.sender);
        } else if (msg.sender == g.player2) {
            require(g.choices2[0] == 0, "Already revealed");
            require(g.commit2 == commitHash, "Hash mismatch");
            g.choices2 = choices;
            emit PlayerRevealed(gameId, msg.sender);
        } else {
            revert("Not a player");
        }

        if (g.choices1[0] != 0 && g.choices2[0] != 0) {
            _resolvePvP3(gameId);
        }
    }

    // ===== Timeout =====

    function claimTimeout(uint256 gameId) external gameExists(gameId) {
        Game storage g = games[gameId];
        require(block.timestamp > g.deadline, "Not expired");
        require(g.phase == Phase.Commit || g.phase == Phase.Reveal, "Invalid phase");

        if (g.phase == Phase.Commit) {
            bool c1 = g.commit1 != bytes32(0);
            bool c2 = g.commit2 != bytes32(0);
            if (c1 && !c2) {
                g.winner = g.player1;
                (bool s, ) = g.player1.call{value: g.stake * 2}("");
                require(s);
            } else if (c2 && !c1) {
                g.winner = g.player2;
                (bool s, ) = g.player2.call{value: g.stake * 2}("");
                require(s);
            } else {
                (bool s1, ) = g.player1.call{value: g.stake}("");
                (bool s2, ) = g.player2.call{value: g.stake}("");
                require(s1 && s2);
            }
        } else {
            bool r1 = g.choices1[0] != 0;
            bool r2 = g.choices2[0] != 0;
            if (r1 && !r2) {
                g.winner = g.player1;
                (bool s, ) = g.player1.call{value: g.stake * 2}("");
                require(s);
            } else if (r2 && !r1) {
                g.winner = g.player2;
                (bool s, ) = g.player2.call{value: g.stake * 2}("");
                require(s);
            } else {
                (bool s1, ) = g.player1.call{value: g.stake}("");
                (bool s2, ) = g.player2.call{value: g.stake}("");
                require(s1 && s2);
            }
        }
        g.phase = Phase.Finished;
    }

    // ===== Bot Best of 3 (1 tx) =====

    function playBotBestOf3(uint8[3] calldata choices) external {
        for (uint256 i = 0; i < 3; i++) {
            require(choices[i] >= 1 && choices[i] <= 3, "Invalid choice");
        }

        uint256 gameId = gameCount++;
        Game storage g = games[gameId];
        g.player1 = msg.sender;
        g.player2 = address(this);
        g.isBot = true;
        g.phase = Phase.Finished;
        g.choices1 = choices;

        uint8 playerWins = 0;
        uint8 botWins = 0;

        for (uint256 i = 0; i < 3; i++) {
            uint256 rand = uint256(keccak256(abi.encodePacked(
                blockhash(block.number - 1), block.timestamp, gameId, msg.sender, i
            )));
            uint8 botChoice = uint8((rand % 3) + 1);
            g.choices2[i] = botChoice;

            if (choices[i] == botChoice) {
                g.roundResults[i] = 3;
            } else if (_winsOver(Choice(choices[i]), Choice(botChoice))) {
                g.roundResults[i] = 1;
                playerWins++;
            } else {
                g.roundResults[i] = 2;
                botWins++;
            }
        }

        g.p1Wins = playerWins;
        g.p2Wins = botWins;
        if (playerWins > botWins) g.winner = msg.sender;
        else if (botWins > playerWins) g.winner = address(this);

        emit BotGame3Ended(gameId, msg.sender, playerWins, botWins);
    }

    // ===== View =====

    function getGame(uint256 gameId) external view gameExists(gameId) returns (Game memory) {
        return games[gameId];
    }

    // ===== Internal =====

    function _resolvePvP3(uint256 gameId) internal {
        Game storage g = games[gameId];
        g.phase = Phase.Finished;

        uint8 p1w = 0;
        uint8 p2w = 0;

        for (uint256 i = 0; i < 3; i++) {
            Choice c1 = Choice(g.choices1[i]);
            Choice c2 = Choice(g.choices2[i]);

            if (c1 == c2) {
                g.roundResults[i] = 3;
            } else if (_winsOver(c1, c2)) {
                g.roundResults[i] = 1;
                p1w++;
            } else {
                g.roundResults[i] = 2;
                p2w++;
            }
        }

        g.p1Wins = p1w;
        g.p2Wins = p2w;

        if (p1w > p2w) {
            g.winner = g.player1;
            (bool s, ) = g.player1.call{value: g.stake * 2}("");
            require(s);
        } else if (p2w > p1w) {
            g.winner = g.player2;
            (bool s, ) = g.player2.call{value: g.stake * 2}("");
            require(s);
        } else {
            (bool s1, ) = g.player1.call{value: g.stake}("");
            (bool s2, ) = g.player2.call{value: g.stake}("");
            require(s1 && s2);
        }

        emit PvPGame3Ended(gameId, g.winner, p1w, p2w);
    }

    function _winsOver(Choice a, Choice b) internal pure returns (bool) {
        return (a == Choice.Rock && b == Choice.Scissors) ||
               (a == Choice.Scissors && b == Choice.Paper) ||
               (a == Choice.Paper && b == Choice.Rock);
    }
}
