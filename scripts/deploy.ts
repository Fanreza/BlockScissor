import { ethers } from 'hardhat'

async function main() {
  console.log('Deploying RPSGame contract...')

  const RPSGame = await ethers.getContractFactory('RPSGame')
  const rpsGame = await RPSGame.deploy()

  await rpsGame.waitForDeployment()

  const deployedAddress = await rpsGame.getAddress()

  console.log(`RPSGame deployed to: ${deployedAddress}`)
  console.log(`\nNetwork: Somnia Testnet (Chain ID: 50312)`)
  console.log(`Explorer: https://shannon-explorer.somnia.network/address/${deployedAddress}`)

  // Save deployment info
  const deploymentInfo = {
    contract: 'RPSGame',
    address: deployedAddress,
    network: 'somniaTestnet',
    chainId: 50312,
    timestamp: new Date().toISOString(),
  }

  console.log('\nDeployment Info:')
  console.log(JSON.stringify(deploymentInfo, null, 2))

  // For local testing
  if (process.env.VERIFY_CONTRACT !== 'false') {
    console.log('\nWaiting for contract to be indexed...')
    await new Promise((resolve) => setTimeout(resolve, 30000))

    try {
      console.log('Verifying contract on block explorer...')
      await ethers.provider.waitForTransaction(rpsGame.deploymentTransaction()?.hash || '')
    } catch (err) {
      console.log('Contract verification will need to be done manually')
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
