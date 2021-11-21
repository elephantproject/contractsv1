const TL = artifacts.require('Timelock.sol')

const adminaddress = ""

module.exports = async function(deployer) {
  await deployer.deploy(TL, adminaddress, time)
}
