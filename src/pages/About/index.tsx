import './style.css'
import CreateLoanSS from '../../assets/guide/createLoan.png'

export default function About() {
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
            To create a guide, head over to the <a href="/create">Create</a> page.
            After you are done filling out the form click on 'Submit Loan' to 
            initialize a new loan.
          </span>
        </div>
        <img src={CreateLoanSS}/>
      </div>
      <div className="stepContainer">
        <div className="stepTitleContainer">
          <h1>Manage loans</h1>
          <span>
            To manage your loans, head over to the <a href="/loans">Loans</a> page.
            If you want to open the dashboard, simply click on a loan.
          </span>
        </div>
        <img src={CreateLoanSS}/>
      </div>
      <div className="stepContainer">
        <div className="stepTitleContainer">
          <h1>Confirm a loan</h1>
          <span>
            Both parties need to confirm the loan.
            All assets and collateral need to be transferred to the LendFi contract
            from the lender and borrower.
          </span>
        </div>
        <img src={CreateLoanSS}/>
      </div>
    </div>
  </div>
}