const { ethers } = require('hardhat');

async function main() {
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'",
    );
  }

  const Token = await ethers.getContractFactory('Token');
  const token = await Token.deploy();
  await token.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
