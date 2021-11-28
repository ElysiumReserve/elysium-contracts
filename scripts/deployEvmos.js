const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  const accounts = await ethers.getSigners();
  accounts.forEach(function (account, index, _) {
    console.log(`account ${index}` + account.toJSON());
  })

  console.log('Deploying contracts with the account: ' + deployer.address);

  const firstEpochNumber = "";
  const firstBlockNumber = "";

  const Authority = await ethers.getContractFactory("OlympusAuthority");
  const authority = await Authority.deploy(
    deployer.address,
    deployer.address,
    deployer.address,
    deployer.address
  );
  console.log("Authority: " + authority.address);

  const OHM = await ethers.getContractFactory('OlympusERC20Token');
  console.log("got OHM factory");
  const ohm = await OHM.deploy(authority.address);
  console.log("OHM: " + ohm.address);

  const OlympusTreasury = await ethers.getContractFactory('OlympusTreasury');
  console.log("got Olympus Treasury");
  const olympusTreasury = await OlympusTreasury.deploy(ohm.address, '0', authority.address);
  console.log("Olympus Treasury: " + olympusTreasury.address);

  const SOHM = await ethers.getContractFactory('sOlympus');
  const sOHM = await SOHM.deploy();
  console.log("Staked Olympus: " + sOHM.address);

  const GOHM = await ethers.getContractFactory("gOHM");
  const gOHM = await GOHM.deploy(migrator.address, sOHM.address);
  console.log("gOHM: " + gOHM.address);

  const OlympusStaking = await ethers.getContractFactory('OlympusStaking');
  const staking = await OlympusStaking.deploy(ohm.address, sOHM.address, gOHM.address, '2200', firstEpochNumber, firstBlockNumber, authority.address);
  console.log("Staking Contract: " + staking.address);

  const Distributor = await ethers.getContractFactory('Distributor');
  const distributor = await Distributor.deploy(olympusTreasury.address, ohm.address, staking.address, authority.address);

  await sOHM.setIndex('');
  await sOHM.setgOHM(gOHM);
  await sOHM.initialize(staking.address, olympusTreasury.address);

  console.log("Distributor: " + distributor.address);
}

main()
  .then(() => process.exit())
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
