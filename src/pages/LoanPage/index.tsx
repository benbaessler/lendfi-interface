import './style.css'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useParams, Redirect } from "react-router-dom"
import getContract from '../../utils/getContract'
import { useWeb3React } from '@web3-react/core'
import { Loan } from '../../types/loan'
import { formatDeadline, getStatusDetails, getConfirmations } from '../../utils/loanDetails'
import { Spinner } from 'react-bootstrap'
import { shortenAddress } from '../../utils'
import { utils, Contract, BigNumber } from 'ethers'
import ERC721ABI from '../../abis/ERC721.json'
import { etherscanBaseUrl, factoryAddress } from '../../constants'
import CollateralPopup from '../../components/ViewCollateral';
import { getToken } from '../../utils/tokens'
import { AlchemyAPIToken } from '../../types'

interface RouteParams {
  id: string
}

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const LoanPage: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const loanId = params.id

  const [loading, setLoading] = useState<boolean>(true)

  const { account, active, library } = useWeb3React()
  const [loan, setLoan] = useState<Loan>()

  // Loan Details
  const [statusDetails, setStatusDetails] = useState<string[]>()

  const [collateralData, setCollateralData] = useState<AlchemyAPIToken>()
  const [showCollateral, setShowCollateral] = useState<boolean>(false)

  // Loan Manager
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [loanActive, setLoanActive] = useState<boolean>(false)

  const [tokensApproved, setTokensApproved] = useState<boolean>(true)

  const [deadlineError, setDeadlineError] = useState<boolean>(false)
  const [claimActive, setClaimActive] = useState<boolean>(false)

  const [deadlineInput, setDeadlineInput] = useState<string>('')
  const onDeadlineChange = (event: any) => setDeadlineInput(event.target.value)

  const confirmLender = async () => {
    const factoryContract = getContract(library.getSigner())
    await factoryContract.confirmLender(loanId, { value: BigNumber.from(loan!.amount).add(loan!.amount / 100)})

    console.log(`Successfully confirmed Loan by depositing ${utils.formatEther(loan!.amount)} ETH into the Loan Contract!`)
  }

  const confirmBorrower = async (_loan: Loan) => {
    // Approving NFT for Contract
    if (!tokensApproved) {
      const collateralContract = new Contract(_loan.collateral[0], ERC721ABI, library.getSigner())
      await collateralContract.setApprovalForAll(factoryAddress, true)
    } else {
      // Calling Contract function
      const factoryContract = getContract(library.getSigner())
      await factoryContract.confirmBorrower(loanId).then(() => {
        setConfirmed(true)
      })
    }
  }

  const claimCollateral = async () => {

  }

  const extendDeadline = async () => {
    const factoryContract = getContract(library.getSigner())

    const unixDeadline = Math.round((new Date(deadlineInput!)).getTime() / 1000)

    try {
      await factoryContract.extendDeadline(loanId, unixDeadline)
    } catch (error: any) {
      // In case the user inputs a new deadline which is before the old one
      if (error.message.split('[')[0] === 'cannot estimate gas; transaction may fail or may require manual gas limit ') {
        setDeadlineError(true)
      }
      return
    } 

    setDeadlineError(false)
    console.log('Success! New deadline:', unixDeadline)
  }

  const paybackLoan = async () => {
    const factoryContract = getContract(library.getSigner())
    const tx = await factoryContract.paybackLoan(loanId, { value: BigNumber.from(loan!.amount).add(loan!.interest) })
    console.log(`Successfully paid back loan (${tx.hash})`)
  }

  const init = async () => {
    // Getting Loan data
    const factoryContract = getContract(library.getSigner())
    const _loan = await factoryContract.getLoan(loanId)
    setLoan(_loan)

    const collateralContract = new Contract(_loan.collateral[0], ERC721ABI, library.getSigner())

    // Getting Loan status
    const _statusDetails = getStatusDetails(_loan)
    setStatusDetails(_statusDetails)

    // Updating UI status
    if (_loan.lender === account && _loan.lenderConfirmed) setConfirmed(true)
    else if (_loan.borrower === account && _loan.borrowerConfirmed) setConfirmed(true)
    if (_loan.borrower === account && !_loan.borrowerConfirmed) {
      const approved: boolean = await collateralContract.isApprovedForAll(_loan.borrower, factoryAddress)
      setTokensApproved(approved)
      console.log(approved)
    }
    if (_loan.active) setLoanActive(true)
    if (Number(_loan.deadline) < Math.round(Date.now() / 1000) && !_loan.executed) setClaimActive(true)

    // Getting Collateral NFT metadata
    const tokenMetadata = await getToken(_loan.collateral[0], _loan.collateral[1])
    setCollateralData(tokenMetadata)

    setLoading(false)
  }

  useEffect(() => { if (active) init() }, [active])

  // ! : Add Redirect for non-existing Loan ID.

  return <>
    <div className="interfaceContainer dashboardWrapper">
    {loading ? <Spinner animation="border" variant="light" style={{
      position: 'absolute',
      right: '50%',
      bottom: '50%',
    }}/> : <div className="dashboardContainer">

      <CollateralPopup data={collateralData} show={showCollateral} onClose={() => setShowCollateral(false)}/>
      
      <div className="topContainer">
        <h1 id="dbTitle">Manage Loan</h1>
        <div className="statusContainer">
          <h3 style={{ margin: 0 }}>{statusDetails![0]}</h3>
          <div id="statusIndicator" style={{ backgroundColor: statusDetails![1] }}/>
        </div>
      </div>

      <div className="dbContentWrapper">
        <div className="dbDetailsContainer">
          <div className="dbDetailSection">
            <h3>Lender</h3>
            {/* Remove rinkeby for production version */}
            <h4><a href={etherscanBaseUrl + `address/${loan!.lender}`} target="_blank" rel="noopener noreferrer">{shortenAddress(loan!.lender)}</a></h4>
          </div>
          <div className="dbDetailSection">
            <h3>Borrower</h3>
            <h4><a href={etherscanBaseUrl + `address/${loan!.borrower}`} target="_blank" rel="noopener noreferrer">{shortenAddress(loan!.borrower)}</a></h4>
          </div>
          <div className="dbDetailSection">
            <h3>Amount</h3>
            <h4>{utils.formatEther(loan!.amount)} ETH</h4>
          </div>
          <div className="dbDetailSection">
            <h3>Interest</h3>
            <h4>{Number(utils.formatEther(loan!.interest)) / Number(utils.formatEther(loan!.amount)) * 100}% ({utils.formatEther(loan!.interest)} ETH)</h4>
          </div>
          <div className="dbDetailSection" style={{ width: '100%' }}>
            <h3>Deadline</h3>
            <h4>{formatDeadline(loan!.deadline).toLocaleString()}</h4>
          </div>
          <div className="dbDetailSection" style={{ width: '100%', display: 'flex' }}>
            <h3 style={{ marginRight: '15px' }}>Collateral</h3>
            <div className="addButton" onClick={() => setShowCollateral(true)}>View</div>
          </div>
        </div>
        <div className="dbManageSection">
          <div className={loanActive || loan!.executed ? 'disabledSection' : ''}>
            <h3>Confirmations: <b>({getConfirmations(loan!)}/2)</b></h3>
            <p>{loan!.lender === account ? 
              `Confirm the Loan by transferring ${utils.formatEther(loan!.amount)} ETH into the Loan Contract.` :
              `Confirm the Loan by transferring the Collateral NFT(s) to the Loan Contract.`
            }</p>
            <div 
              className="button submitButton dbButton" 
              id={confirmed ? 'disabled' : ''}
              onClick={!confirmed ? loan!.lender === account ? confirmLender : () => confirmBorrower(loan!) : () => {}}
            >{loan!.borrower === account && !tokensApproved ? 'Approve' : confirmed ? 'Confirmed' : 'Confirm'}</div>
          </div>
          {loan!.lender === account ? <div className={loan!.executed ? 'disabledSection' : ''}>
            <div className="extendDeadlineTitleWrapper">
              <h3>Extend Deadline</h3>
              <p style={{ display: deadlineError ? '' : 'none'}}>You can not shorten the deadline</p>
            </div>
            <div className="input" style={{ height: '35px', marginBottom: '12px' }}>
              <input type="datetime-local" value={deadlineInput} onChange={onDeadlineChange}/>
            </div>
            <div 
              className="button submitButton dbButton" 
              onClick={extendDeadline}
          >Update</div>
          </div> : <div className={!loan!.active || loan!.executed ? 'disabledSection': ''}>
            <h3>Pay Loan</h3>
            <p>You will receive your Collateral NFT as soon as the Loan is paid.</p>
            <div 
              className="button submitButton dbButton" 
              id={loan!.executed ? 'disabled' : ''}
              onClick={loan!.active ? paybackLoan : () => {}}
            >Transfer {utils.formatEther(BigNumber.from(loan!.amount).add(loan!.interest))} ETH</div>
          </div>}
          {loan!.lender === account ? <div className={!loan!.active || loan!.executed ? 'disabledSection' : ''}>
            <h3>Claim Collateral</h3>
            <p>You can claim the tokens if the Loan has expired and the Lender has not paid back the Loan.</p>
            <div 
              className="button submitButton dbButton" 
              id={loan!.collateralClaimed ? 'disabled' : ''}
              onClick={claimActive ? claimCollateral : () => {}}
            >Claim</div>
          </div> : <div/>}
        </div>
      </div>
    </div>}
  </div>
  </>
}