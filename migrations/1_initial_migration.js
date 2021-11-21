const GOV = artifacts.require('GovernanceToken.sol')
const MB = artifacts.require('MasterBreeder.sol')
const PIT = artifacts.require('Pit.sol')
const PB = artifacts.require('PitBreeder.sol')
const TL = artifacts.require('Timelock.sol')

const Web3 = require('web3')
const { ethers } = require('ethers')

// Globals //

const testnetfactory = '0x663eeee1CcE3754799351cc707C34b5F0fc0A11A'
const FACTORY = '0xCB6F8286DC593eeA6D428f1Dfa0A62FEE6B294a3'

const wone = '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a'
const wonetest = '0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2'
// End Gov Consts //

// Masterbreeder //

// Mainnet addr.

const devaddress = process.env.DEVADDRESS
const founderaddress = process.env.FOUNDERADDRESS
const liquidityaddress = process.env.LIQUIDITYADDRESS
const communityfundaddress = process.env.COMMUNITYFUNADDRESS
const authorizeaddress = process.env.AUTHORIZEADDRESS
const deployaddress = process.env.DEPLOYADDRESS
const minttoaddress = devaddress


// Testnet addr.

const devaddresstest = '0xd2dd6f9f89635991f9bd0a2090fadca66383f7f6'
const liquidityaddresstest = '0xdbdd7619de1cda2c7d839f0508191b1f6c6a85b5'
const communityfundaddresstest = '0x2dbae855635106c16ffb5c632835367ee2061ea5'
const founderaddresstest = '0xef426670bbcfee1133f8f6878230a10add072990'



const rewardsperblock = ethers.utils.parseUnits('1')
const startblock = 18297987
const halvingafterblock = 302400
const userdepfee = 75
const devdepfee = 9925
const rewardMultipliers = [
  256,
  128,
  64,
  32,
  32,
  16,
  16,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  4,
  4,
  4,
  4,
  4,
  4,
  2,
  2,
  2,
  2,
  2,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  4,
  4,
  4,
  8,
  8,
  8,
  8,
  8,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  8,
  8,
  8,
  8,
  8,
  8,
  4,
  4,
  2,
  2,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  4,
  4,
  4,
  4,
  8,
  8,
  8,
  8,
  8,
  16,
  16,
  32,
  32,
  32,
  32,
  16,
  8,
  4,
  2,
  1,
  1,
  1,
  1,
  2,
  2,
]
const blockdeltastartstage = [0, 1, 275, 6601, 19801, 33001, 90721, 181441]
const blockdeltaendstage = [274, 6600, 19800, 33000, 90720, 181440]
const userfeestage = [75, 92, 96, 98, 99, 995, 9975, 9999]
const devfeestage = [25, 8, 4, 2, 1, 5, 25, 1]

// gov token constants //

const name = 'Elephant'
const symbol = 'ELEPHANT'
const supply = ethers.utils.parseUnits('500000000')
const maxmint = ethers.utils.parseUnits('5000000')
const initialmint = ethers.utils.parseUnits('1000000')
const lockblock = startblock
const endblock = startblock + (34*halvingafterblock)

//


const pool0 = "0x10B789960c098D7080B1b7Eb0607428e12aD519b"
// const pool1 = "0x4e545f723908FF0a3259000678198fDD41978923"
// const pool2 = "0x9cB4bA2731E8E2b34C41d0c70F0565b11d6Fa817"


// End Masterbreeder consts //

module.exports = async function(deployer, network) {
  if (network === 'mainnet0') {
    await console.log(endblock)
    await deployer.deploy(GOV, name, symbol, supply, maxmint, lockblock, endblock)

    const deployedGOV = await GOV.deployed()

    await deployedGOV.addAuthorized(devaddress)

    await deployer.deploy(
      MB,
      GOV.address,
      devaddress,
      liquidityaddress,
      communityfundaddress,
      founderaddress,
      rewardsperblock,
      startblock,
      halvingafterblock,
      userdepfee,
      devdepfee,
      rewardMultipliers,
      blockdeltastartstage,
      blockdeltaendstage,
      userfeestage,
      devfeestage
    )

    await console.log('Breeder Deployed')

    const deployedbreeder = await MB.deployed()
    await deployedbreeder.addAuthorized(devaddress)

    await deployedGOV.transferOwnership(deployedbreeder.address)

    await deployedbreeder.lockUpdate(95) // lock
    await console.log('95% locked')
    await deployedbreeder.lockcomUpdate(6) // 6% rewards to community rewards pool
    await console.log('Com locked')

    await deployedbreeder.lockdevUpdate(6) // 6% rewards to dev rewards pool
    await console.log('Dev locked')

    await deployedbreeder.lockfounderUpdate(4) // 6% rewards to founder rewards pool
    await console.log('Founder locked')

    await deployedbreeder.locklpUpdate(4) // 4% rewards to lp rewards pool
    await console.log('LP locked')

    // await deployedGOV.removeAuthorized(deployaddress)

    // await console.log('Deploy Removed')

    await deployedbreeder.transferOwnership(devaddress)
    await console.log('ownership transfered2')

    //  transfer ownership //

    // ADD POOLS //

    // await console.log('Adding Pools...')

    // const addpool0 = await deployedbreeder.add(3, pool0, true)
    // const testinfo = await deployedbreeder.poolInfo(0)

    // console.log(testinfo)

    // expect 1 pool //

    await console.log('GOV', GOV.address)
    await console.log('MB', MB.address)
  } else {
    await deployer.deploy(GOV, name, symbol, supply, maxmint, lockblock, endblock)

    const deployedGOV = await GOV.deployed()

    await deployedGOV.addAuthorized(authorizeaddress)

    await deployedGOV.manualMint(minttoaddress, initialmint)

    await deployer.deploy(
      MB,
      GOV.address,
      devaddresstest,
      liquidityaddresstest,
      communityfundaddresstest,
      founderaddresstest,
      rewardsperblock,
      startblock,
      halvingafterblock,
      userdepfee,
      devdepfee,
      rewardMultipliers,
      blockdeltastartstage,
      blockdeltaendstage,
      userfeestage,
      devfeestage
    )

    const deployedbreeder = await MB.deployed()

    //  transfer ownership //
    const transferown = await deployedGOV.transferOwnership(deployedbreeder.address)

    await console.log('ownership transfered')

    await deployedbreeder.add(10, '0x841a9208f6eccf03e39aaA7F9B411622311a1789', true)
    await deployedbreeder.add(10, '0xedE371fEB2bDBe60609Da7Ff7a488DC4ff8F6A98', true)
    await deployedbreeder.add(10, '0x196d1E5fDCd5C5ff7Ba2FD672d7CA01D6A67B7Bf', true)

    await deployedbreeder.lockUpdate(95)
    await deployedbreeder.lockcomUpdate(6) // 6% rewards to community rewards pool
    await deployedbreeder.lockdevUpdate(6) // 6% rewards to dev rewards pool
    await deployedbreeder.lockfounderUpdate(4) // 4% rewards to founder rewards pool
    await deployedbreeder.locklpUpdate(4) // 4% rewards to lp rewards pool
    await deployedbreeder.addAuthorized('0xf157f339b2934927fe1b163ab372e65adb14b084')
    minttoaddress

    await deployer.deploy(PIT, 'ElephantPit', 'xElephant', GOV.address)
    await deployer.deploy(PB, testnetfactory, PIT.address, GOV.address, wonetest)
    await deployer.deploy(TL)

    await console.log('GOV', GOV.address)
    await console.log('MB', MB.address)
    await console.log('PIT', PIT.address)
    await console.log('PB', PB.address)
    await console.log('TL', TL.address)
  }
}
