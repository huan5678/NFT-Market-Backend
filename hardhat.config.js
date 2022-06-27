require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const METAMASK_ACCOUNT = process.env.METAMASK_ACCOUNT;
const INFURA_RINKEBY_KEY = process.env.INFURA_RINKEBY_KEY;

module.exports = {
  solidity: '0.8.1',
  compilers: [
    {
      version: '0.7.0',
    },
    {
      version: '0.7.3',
    },
    {
      version: '0.8.0',
    },
    {
      version: '0.8.1',
    },
  ],
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://127.0.0.1:8545',
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
      ],
    },
    hardhat: {
      chainId: 1337,
      mining: {
        auto: false,
        interval: [3000, 6000],
      },
    },
    rinkeby: {
      url: INFURA_RINKEBY_KEY,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
  paths: {
    sources: 'src',
  },
};
