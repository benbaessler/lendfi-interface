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
import { CollateralContext } from '../../state/collateral';

interface RouteParams { id: string }

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const LoanPage: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const loanId = params.id

  const [loading, setLoading] = useState<boolean>(true)

  const { account, active, library } = useWeb3React()
  const [loan, setLoan] = useState<Loan>()

  // Loan Details
  const [statusDetails, setStatusDetails] = useState<string[]>()

  // Collateral
  const [collateralData, setCollateralData] = useState<AlchemyAPIToken>()
  const [showCollateral, setShowCollateral] = useState<boolean>(false)

  // Loan Manager

  // Confirm Button state
  const [tokensApproved, setTokensApproved] = useState<boolean>(true)
  const [confirmBtnText, setConfirmBtnText] = useState<string>('Confirm')
  const [confirmBtnActive, setConfirmBtnActive] = useState<boolean>(true)

  // Button state
  const [extendBtnText, setExtendBtnText] = useState<string>('Update')
  const [extendBtnActive, setExtendBtnActive] = useState<boolean>(true)

  const [claimBtnText, setClaimBtnText] = useState<string>('Claim')
  const [claimBtnActive, setClaimBtnActive] = useState<boolean>(false)
  
  // Extend deadline input
  const [deadlineInput, setDeadlineInput] = useState<string>('')
  const [deadlineError, setDeadlineError] = useState<boolean>(false)
  const onDeadlineChange = (event: any) => setDeadlineInput(event.target.value)

  const init = async () => {
    // Getting Loan data
    const factoryContract = getContract(library.getSigner())
    const _loan = await factoryContract.getLoan(loanId)
    setLoan(_loan)

    // Getting Loan status
    const _statusDetails = getStatusDetails(_loan)
    setStatusDetails(_statusDetails)
    
    const collateralContract = new Contract(_loan.collateral[0], ERC721ABI, library.getSigner())
    
    // Updating UI status
    if (_loan.lender === account && _loan.lenderConfirmed) setConfirmed()
    else if (_loan.borrower === account && _loan.borrowerConfirmed) setConfirmed()
    if (_loan.borrower === account && !_loan.borrowerConfirmed) {
      const approved: boolean = await collateralContract.isApprovedForAll(_loan.borrower, factoryAddress)
      setTokensApproved(approved)
      if (!approved) setConfirmBtnText('Approve')
    }
    if (Number(_loan.deadline) < Math.round(Date.now() / 1000) && _loan.active) {
      setClaimBtnActive(true)
    }
    if (_loan.collateralClaimed) setClaimBtnText('Claimed')
    if (_loan.executed && !_loan.collateralClaimed) setClaimBtnText('Loan paid')

    // Getting Collateral NFT metadata
    const tokenMetadata = await getToken(_loan.collateral[0], _loan.collateral[1])
    setCollateralData(tokenMetadata)

    setLoading(false)
  }

  const setConfirmed = () => {
    setConfirmBtnActive(false)
    setConfirmBtnText('Confirmed')
  }

  const confirmLender = async () => {
    setConfirmBtnActive(false)
    setConfirmBtnText('Confirming...')

    const factoryContract = getContract(library.getSigner())
    await factoryContract.confirmLender(loanId, { value: BigNumber.from(loan!.amount).add(loan!.amount / 100)}).then(() => {
      setConfirmed()
    }).catch((error: any) => {
      setConfirmBtnText('Confirm')
      setConfirmBtnActive(true)
    })
  }

  const confirmBorrower = async (_loan: Loan) => {
    setConfirmBtnActive(false)
    const collateralContract = new Contract(_loan.collateral[0], ERC721ABI, library.getSigner())

    if (!tokensApproved) {
      setConfirmBtnText('Approving...')

      // Approving NFT for interaction with smart contract
      await collateralContract.setApprovalForAll(factoryAddress, true).then(() => {
        setTokensApproved(true)
        setConfirmBtnText('Confirm')
        setConfirmBtnActive(true)
      }).catch((error: any) => {
        setConfirmBtnActive(true)
        setConfirmBtnText('Approve')
      })
    } else {
      const approved: boolean = await collateralContract.isApprovedForAll(_loan.borrower, factoryAddress)
      if (!approved)

      setConfirmBtnText('Confirming...')

      // Calling Contract function
      const factoryContract = getContract(library.getSigner())
      await factoryContract.confirmBorrower(loanId).then(() => {
        setConfirmed()
      }).catch((error: any) => {
        setConfirmBtnActive(true)
        setConfirmBtnText('Confirm')
      })
    }
  }

  const claimCollateral = async () => {
    setClaimBtnText('Claiming...')
    setClaimBtnActive(false)

    const factoryContract = getContract(library.getSigner())
    await factoryContract.claimCollateral(loanId).then(() => {
      setClaimBtnText('Claimed')
    }).catch((error: any) => {
      setClaimBtnActive(true)
      setClaimBtnText('Claim')
    })
  }

  const extendDeadline = async () => {
    setExtendBtnText('Updating...')
    setExtendBtnActive(false)
    setDeadlineError(false)

    const factoryContract = getContract(library.getSigner())
    const unixDeadline = Math.round((new Date(deadlineInput!)).getTime() / 1000)

    await factoryContract.extendDeadline(loanId, unixDeadline).then(() => {
      setExtendBtnText('Update')
      setExtendBtnActive(true)
    }).catch((error: any) => {
      if (error.message.split('[')[0] === 'cannot estimate gas; transaction may fail or may require manual gas limit ') {
        setDeadlineError(true)
      }
      setExtendBtnText('Update')
      setExtendBtnActive(true)
    })
  }

  const paybackLoan = async () => {
    const factoryContract = getContract(library.getSigner())
    const tx = await factoryContract.paybackLoan(loanId, { value: BigNumber.from(loan!.amount).add(loan!.interest).add(loan!.amount / 200) })
    console.log(`Successfully paid back loan (${tx.hash})`)
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
            <h4 style={{ 
              color: statusDetails![0] === 'Expired' ? '#ff0000' : '',
              opacity: statusDetails![0] === 'Expired' ? .7 : 1
            }}>{formatDeadline(loan!.deadline).toLocaleString()}</h4>
          </div>
          <div className="dbDetailSection" id="collatDetailSection">
            <h3>Collateral</h3>
            <div 
              className="addButton" 
              onClick={() => setShowCollateral(true)}
              style={{ width: '40%' }}
            >View</div>
          </div>
        </div>
        <div className="dbManageSection">
          <div className={loan!.active || loan!.executed || statusDetails![0] === 'Expired' ? 'disabledSection' : ''}>
            <h3>Confirmations: <b>({getConfirmations(loan!)}/2)</b></h3>
            <p>{loan!.lender === account ? 
              `Confirm the Loan by transferring ${utils.formatEther(loan!.amount)} ETH into the Loan Contract.` :
              `Confirm the Loan by transferring the Collateral NFT(s) to the Loan Contract.`
            }</p>
            <div 
              className="button submitButton dbButton" 
              id={!confirmBtnActive || loan!.active || statusDetails![0] === 'Expired' ? 'disabled' : ''}
              onClick={confirmBtnActive ? loan!.lender === account ? confirmLender : () => confirmBorrower(loan!) : () => {}}
            >{confirmBtnText}</div>
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
              id={loan!.executed || !extendBtnActive ? 'disabled': ''}
              onClick={loan!.executed || !extendBtnActive ? () => {} : extendDeadline}
            >{extendBtnText}</div>
            </div> : <div className={!loan!.active || loan!.executed || statusDetails![0] === 'Expired' ? 'disabledSection': ''}>
              <h3>Pay Loan</h3>
              <p>You will receive your Collateral NFT as soon as the Loan is paid.</p>
              <div 
                className="button submitButton dbButton" 
                id={loan!.executed ? 'disabled' : ''}
                onClick={loan!.active ? paybackLoan : () => {}}
              >{loan!.loanPaid ? 'Paid' : 'Transfer'}</div>
            </div>}
            {loan!.lender === account ? <div className={loan!.active && statusDetails![0] === 'Expired' ? '' : 'disabledSection'}>
              <h3>Claim Collateral</h3>
              <p>You can claim the tokens if the Loan has expired and the Lender has not paid back the Loan.</p>
              <div 
                className="button submitButton dbButton" 
                id={claimBtnActive ? '' : 'disabled'}
                onClick={claimBtnActive ? claimCollateral : () => {}}
              >{claimBtnText}</div>
            </div> : <div/>}
          </div>
        </div>
      </div>}
    </div>
  </>
}