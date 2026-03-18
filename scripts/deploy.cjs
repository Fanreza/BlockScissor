const hre = require('hardhat')

async function main() {
  console.log('Deploying RPSGame contract...')

  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not found in environment')
  }

  const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider)
  const RPSGame = await hre.ethers.getContractFactory('RPSGame', wallet)
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

  console.log('\n✅ Deployment successful!')
  console.log(`\nUpdate your .env.local:`)
  console.log(`NUXT_PUBLIC_CONTRACT_ADDRESS=${deployedAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
