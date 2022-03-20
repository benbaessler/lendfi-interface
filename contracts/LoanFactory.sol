// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

contract LoanFactory {

  event SubmitLoan(
    uint256 indexed id,
    address indexed lender,
    address indexed borrower,
    uint256 amount,
    NFT collateral,
    uint256 deadline
  );

  event ConfirmLoan(uint256 indexed id, address indexed user);
  event RevokeConfirmation(uint256 indexed id, address indexed user);

  struct NFT {
    address contractAddress;
    uint256 tokenId;
  } 

  struct Loan {
    address lender;
    address borrower;
    uint256 amount;
    NFT collateral;
    uint256 deadline;
    bool executed;
    uint256 confirmations;
  }

  mapping(uint256 => mapping(address => bool)) public isConfirmed;

  Loan[] public loans;

  modifier loanExists(uint256 _id) {
    require(_id < loans.length, "This loan does not exist");
    _;
  }

  modifier notActive(uint256 _id) {
    require(loans[_id].confirmations < 2, "This loan was already confirmed");
    _;
  }

  modifier notExecuted(uint256 _id) {
    require(!loans[_id].executed, "This loan was already executed");
    _;
  }

  modifier isParticipator(uint256 _id) {
    Loan memory loan = loans[_id];
    require(loan.lender == msg.sender || loan.borrower == msg.sender, "You are not participating in this loan");
    _;
  }

  function submitLoan(address _lender, address _borrower, uint256 _amount, NFT memory _collateral, uint256 _deadline) public returns (uint256) {
    uint256 id = loans.length;

    loans.push(
      Loan({
        lender: _lender,
        borrower: _borrower,
        amount: _amount,
        collateral: _collateral,
        deadline: _deadline,
        executed: false,
        confirmations: 0
      })
    );

    emit SubmitLoan(id, _lender, _borrower, _amount, _collateral, _deadline);

    return id;
  }

  function confirmLoan(uint256 _id) public loanExists(_id) notActive(_id) notExecuted(_id) isParticipator(_id) {
    require(!isConfirmed[_id][msg.sender], "You already confirmed this loan");

    loans[_id].confirmations += 1;
    isConfirmed[_id][msg.sender] = true;

    emit ConfirmLoan(_id, msg.sender);
  }

  function revokeConfirmation(uint256 _id) public loanExists(_id) notActive(_id) notExecuted(_id) isParticipator(_id) {
    require(isConfirmed[_id][msg.sender], "You did not confirm this loan");

    loans[_id].confirmations -= 1;
    isConfirmed[_id][msg.sender] = false;

    emit RevokeConfirmation(_id, msg.sender);
  }

}