import './style.css'

import { useEffect } from 'react'

import CreateLoanSS from '../../assets/guide/createLoan.png'
import ManageLoansSS from '../../assets/guide/manageLoans.png'
import ConfirmLoanSS from '../../assets/guide/confirmLoan.png'
import RevokeConfirmationSS from '../../assets/guide/revokeConfirmation.png'
import PaybackLoanSS from '../../assets/guide/paybackLoan.png'
import ClaimCollateralSS from '../../assets/guide/claimCollateral.png'
import extendDeadlineSS from '../../assets/guide/extendDeadline.png'
import { factoryAddress } from '../../constants/index';

export default function About() {

  useEffect(() => {
    document.title = 'LendFi - About'
  }, [])

  return <div className="aboutWrapper">
    <div className="aboutContainer aboutSectionContainer">
      <h1>About</h1>
      <span>
        LendFi is a private Lending platform that allows you to securely lend & borrow with NFT collateral (ERC-721).
        Please note that this app is only available on the Rinkeby test network.
      </span>
    </div>
    <div className="processContainer aboutSectionContainer">
      <h1>Guide</h1>
      <div className="stepContainer">
        <div className="stepTitleContainer">
          <h1>Initialize a loan</h1>
          <span>
            To create a loan, head over to the <a href="/create">Create</a> page.
            After you are done filling out the form click on 'Submit Loan' to 
            initialize a new loan.
          </span>
        </div>
        <img src={CreateLoanSS}/>
      </div>
      <div className="stepContainer" id="manageLoansSection">
        <div className="stepTitleContainer">
          <h1>Manage loans</h1>
          <span>
            To manage your loans, head over to the <a href="/loans">Loans</a> page.
            Click on a loan if you want to open the dashboard.
          </span>
        </div>
        <img src={ManageLoansSS}/>
      </div>
      <div className="stepContainer" id="confirmLoanSection"> 
        <div className="stepTitleContainer">
          <h1>Confirm a loan</h1>
          <span>
            Both parties need to confirm the loan.
            All assets and collateral need to be transferred to the LendFi contract
            from the lender and borrower.
          </span>
        </div>
        <img src={ConfirmLoanSS}/>
      </div>
      <div className="stepContainer" id="revokeConfirmationSection"> 
        <div className="stepTitleContainer">
          <h1>Revoking confirmation</h1>
          <span>
            Calling this function will transfer ETH or the NFT you depositted into the contract
            back to your wallet.
          </span>
        </div>
        <img src={RevokeConfirmationSS}/>
      </div>
      <div className="stepContainer" id="paybackLoanSection"> 
        <div className="stepTitleContainer">
          <h1>Paying back a loan</h1>
          <span>
            Once the loan is confirmed, the borrower has until the deadline to 
            pay back the loan amount plus interest.
          </span>
        </div>
        <img src={PaybackLoanSS}/>
      </div>
      <div className="stepContainer" id="claimCollateralSection"> 
        <div className="stepTitleContainer">
          <h1>Claiming collateral</h1>
          <span>
            If the borrower has failed to pay back the loan before
            the deadline, the lender can claim the Collateral NFT.
          </span>
        </div>
        <img src={ClaimCollateralSS}/>
      </div>
      <div className="stepContainer" id="extendDeadlineSection"> 
        <div className="stepTitleContainer">
          <h1>Extending the deadline</h1>
          <span>
            As long as the loan is not executed, the lender can extend the deadline at any time.
            Executed = paid or claimed collateral
          </span>
        </div>
        <img src={extendDeadlineSS}/>
      </div>
    </div>

    <div className="detailsContainer aboutSectionContainer">
      <div style={{ width: '50%'}}>
        <h4>Built by <b>Ben Baessler</b></h4>
        <span>
          <a 
            href="https://benbaessler.com"
            target="_blank"
            rel="noreferrer noopener"
          >Website</a> | 
          <a 
            href="https://github.com/benbaessler"
            target="_blank"
            rel="noreferrer noopener"
          > GitHub</a> |
          <a 
            href="https://twitter.com/ohCurles"
            target="_blank"
            rel="noreferrer noopener"
          > Twitter</a> | 
          <a 
            href="https://etherscan.io/address/curles.eth"
            target="_blank"
            rel="noreferrer noopener"
          > Etherscan</a>
        </span>
      </div>
      <div className="detailsContractInfo">
        <div style={{ marginBottom: '15px' }}><span>LendFi Contract (Rinkeby): <a 
          href={`https://rinkeby.etherscan.io/address/${factoryAddress}`}
          target="_blank"
          rel="noreferrer noopener"
        >{factoryAddress}</a></span></div>

        <div><span>View on GitHub:</span></div>
        <span><a
          href="https://github.com/benbaessler/lendfi-interface"
          target="_blank"
          rel="noreferrer noopener"
        >Interface</a> | <a
          href="https://github.com/benbaessler/lendfi-contracts"
          target="_blank"
          rel="noreferrer noopener"
        >Contracts</a>
        </span>
      </div>
    </div>
  </div>
}