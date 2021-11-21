const PIT = artifacts.require('Pit.sol')
const PB = artifacts.require('PitBreeder.sol')
const TL = artifacts.require('Timelock.sol')

const FACTORY = '0x0Dea90EC11032615E027664D2708BC292Bbd976B'
const deployedGOV = '0xC30a7F9c216B945Ff8ACFB389e955A637eB0f478'
const wone = '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a'


module.exports = async function(deployer) {
  await deployer.deploy(PIT, 'ElephantPit', 'xElephant', deployedGOV)
  await deployer.deploy(PB, FACTORY, PIT.address, deployedGOV, wone)

  await console.log('Pit', PIT.address)
  await console.log('Pit Breeder', PB.address)
}
