// SPDX-License-Identifier: MIT
// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

// This is the main building block for smart contracts.
contract Token {
  // Some string type variables to identify the token.
  // The `public` modifier makes a variable readable from outside the contract.
  string public name = 'My Hardhat Token';
  string public symbol = 'MHT';

  // The fixed amount of tokens stored in an unsigned integer type variable.
  uint256 public totalSupply = 1000000;

  // An address type variable is used to store ethereum accounts.
  address payable public owner;

  event BigBenEvent(address indexed from, uint256 timestamp);

  // A mapping is a key/value map. Here we store each account balance.
  mapping(address => uint256) balances;

  /**
   * Contract initialization.
   *
   * The `constructor` is executed only once when the contract is created.
   */
  constructor() {
    // The totalSupply is assigned to transaction sender, which is the account
    // that is deploying the contract.
    balances[msg.sender] = totalSupply;
    owner = payable(msg.sender);
  }

  function transfer(uint256 pay) public payable {
    uint256 lowerBound = 0.0009 ether;
    require(pay > lowerBound, 'Insufficient donate amount');

    console.log('Sender balance is %s tokens', balances[msg.sender]);

    (bool success, ) = owner.call{ value: pay }('');
    require(success, 'Donate failed');

    emit BigBenEvent(msg.sender, block.timestamp);

    // require(balances[msg.sender] >= amount, "Not enough tokens");

    // We can print messages and values using console.log
    // console.log(
    //     "Transferring from %s to %s %s tokens",
    //     msg.sender,
    //     to,
    //     amount
    // );

    // Transfer the amount.
    // balances[msg.sender] -= amount;
    // balances[to] += amount;
  }

  /**
   * Read only function to retrieve the token balance of a given account.
   *
   * The `view` modifier indicates that it doesn't modify the contract's
   * state, which allows us to call it without executing a transaction.
   */
  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }
}
