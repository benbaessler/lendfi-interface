// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";

contract Loan {

  event SubmitLoan(
    uint256 indexed id,
    address indexed lender,
    address indexed borrower,
    uint256 amount,
    NFT[] collateral,
    uint256 deadline
  );

  struct NFT {
    address _address;
    uint256 _tokenId;
  } 

  struct Loan {
    address lender;
    address borrower;
    uint256 amount;
    NFT[] collateral;
    uint256 deadline;
    bool active;
  }

  mapping(uint256 => mapping(address => bool)) public isConfirmed;

  Loan[] public loans;

  function submitLoan(address _lender, address _borrower, uint256 _amount, NFT[] memory _collateral, uint256 _deadline) public {
    uint256 id = loans.length;

    loans.push(
      Loan({
        lender: _lender,
        borrower: _borrower,
        amount: _amount,
        collateral: _collateral,
        deadline: _deadline,
        active: false
      })
    );

    emit SubmitLoan(id, _lender, _borrower, _amount, _collateral, _deadline);
  }
  
}