import './style.css'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useParams, useHistory } from 'react-router-dom';
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

interface RouteParams { id: string }

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const LoanPage: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const history = useHistory()

  const loanId = params.id
  
  const [loading, setLoading] = useState<boolean>(true)

  const { account, active, library } = useWeb3React()
  const [loan, setLoan] = useState<Loan>()

  // Loan Details
  const [statusDetails, setStatusDetails] = useState<string[]>()
  const [isParticipant, setIsParticipant] = useState<boolean>(false)

  // Collateral
  const [collateralData, setCollateralData] = useState<AlchemyAPIToken>()
  const [showCollateral, setShowCollateral] = useState<boolean>(false)

  // Confirm Button state
  const [tokensApproved, setTokensApproved] = useState<boolean>(true)
  const [confirmBtnText, setConfirmBtnText] = useState<string>('Confirm')
  const [confirmBtnActive, setConfirmBtnActive] = useState<boolean>(true)

  // Button state
  const [extendBtnText, setExtendBtnText] = useState<string>('Update')
  const [extendBtnActive, setExtendBtnActive] = useState<boolean>(true)

  const [claimBtnText, setClaimBtnText] = useState<string>('Claim')
  const [claimBtnActive, setClaimBtnActive] = useState<boolean>(false)

  const [paybackBtnText, setPaybackBtnText] = useState<string>('Transfer')
  const [paybackBtnActive, setPaybackBtnActive] = useState<boolean>(false)

  const [revokeBtnText, setRevokeBtnText] = useState<string>('Revoke')
  const [revokeBtnActive, setRevokeBtnActive] = useState<boolean>(false)
  
  // Extend deadline input
  const [deadlineInput, setDeadlineInput] = useState<string>('')
  const [deadlineError, setDeadlineError] = useState<boolean>(false)
  const onDeadlineChange = (event: any) => setDeadlineInput(event.target.value)

  // Updating UI status
  const updateManageInterface = async (data: Loan) => {
    const collateralContract = new Contract(data.collateral[0], ERC721ABI, library.getSigner())
    const expired = Number(data.deadline) < Math.round(Date.now() / 1000)
    let confirmed: boolean

    setIsParticipant(true)

    // Confirmation section
    if (data.lender === account) confirmed = data.lenderConfirmed
    else confirmed = data.borrowerConfirmed
    if (confirmed) setConfirmed()

    // Approve/Confirm button
    if (data.borrower === account && !data.borrowerConfirmed) {
      const approved: boolean = await collateralContract.isApprovedForAll(data.borrower, factoryAddress)
      setTokensApproved(approved)
      if (!approved) setConfirmBtnText('Approve')
    }

    // Pay loan button
    if (data.active && !expired && !data.loanPaid) setPaybackBtnActive(true)
    if (data.loanPaid) setPaybackBtnText('Loan paid')
    if (expired) setPaybackBtnText('Loan expired')

    // Claim Collateral button
    if (expired && data.active) setClaimBtnActive(true)
    if (data.collateralClaimed) setClaimBtnText('Claimed')
    if (data.loanPaid) setClaimBtnText('Loan paid')

    if (expired && !data.active && confirmed) setRevokeBtnActive(true)
  }

  const init = async () => {
    // Getting Loan data
    const factoryContract = getContract(library.getSigner())
    const _loan = await factoryContract.getLoan(loanId).catch((error: any) => {
      history.push('/404')
    })
    setLoan(_loan)

    // Getting Loan status
    const _statusDetails = getStatusDetails(_loan)
    setStatusDetails(_statusDetails)

    if (_loan.lender === account || _loan.borrower === account) updateManageInterface(_loan)
    
    const collateralContract = new Contract(_loan.collateral[0], ERC721ABI, library.getSigner())

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
    await factoryContract.confirmLender(loanId, { value: loan!.amount }).then(() => {
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
      try {
        const tx = await collateralContract.setApprovalForAll(factoryAddress, true)
        await tx.wait()

        setTokensApproved(true)
        setConfirmBtnText('Confirm')
        setConfirmBtnActive(true)
      } catch (error) {
        setConfirmBtnActive(true)
        setConfirmBtnText('Approve')
      }
      
    } else {
      const approved: boolean = await collateralContract.isApprovedForAll(_loan.borrower, factoryAddress)
      if (!approved) return

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
    setPaybackBtnActive(false)
    setPaybackBtnText('Initiating...')

    const factoryContract = getContract(library.getSigner())
    await factoryContract.paybackLoan(loanId, { value: loan!.amount.add(loan!.interest)}).then(() => {
      setPaybackBtnText('Loan paid')
    }).catch((error: any) => {
      setPaybackBtnActive(true)
      setPaybackBtnText('Transfer')
    })
  }

  const revokeConfirmation = async () => {
    setRevokeBtnActive(false)
    setRevokeBtnText('Revoking...')

    const factoryContract = getContract(library.getSigner())

    await factoryContract.revokeConfirmation(loanId).then(() => {
      setRevokeBtnText('Revoked')
    }).catch((error: any) => {
      setRevokeBtnActive(true)
      setRevokeBtnText('Revoke')
    })
  }

  useEffect(() => { if (active) init() }, [active])
  useEffect(() => { document.title = `LendFi - Loan #${loanId}` }, [])

  // ! : Add Redirect for non-existing Loan ID.

  const RevokeConfirmationSection = () => {
    return <div className={statusDetails![0] === 'Expired' && (
      loan!.lender === account && loan!.lenderConfirmed || loan!.borrowerConfirmed
    ) ? '' : 'disabledSection'}>
      <h3>Revoke Confirmation</h3>
      <p>If the loan expires with only 1 confirmation, you can revoke it and claim your depositted assets.</p>
      <div 
        className="button submitButton dbButton" 
        id={revokeBtnActive ? '' : 'disabled'}
        onClick={revokeBtnActive ? revokeConfirmation : () => {}}
      >{revokeBtnText}</div>
    </div>
  }

  return <>
    <div className="interfaceContainer dashboardWrapper" style={{ width: isParticipant ? '80%' : '40%'}}>
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
        <div className="dbDetailsContainer" style={{ width: isParticipant ? '55%' : '100%'}}>
          <div className="dbDetailSection" style={{ marginRight: '50px'}}>
            <h3>Lender</h3>
            {/* Remove rinkeby for production version */}
            <h4><a href={etherscanBaseUrl + `address/${loan!.lender}`} target="_blank" rel="noopener noreferrer">{shortenAddress(loan!.lender)}</a></h4>
          </div>
          <div className="dbDetailSection">
            <h3>Borrower</h3>
            <h4><a href={etherscanBaseUrl + `address/${loan!.borrower}`} target="_blank" rel="noopener noreferrer">{shortenAddress(loan!.borrower)}</a></h4>
          </div>
          <div className="dbDetailSection" style={{ marginRight: '50px'}}>
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
        {isParticipant ? <div className="dbManageSection">
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
              <p className="errorMessage" style={{ display: deadlineError ? '' : 'none'}}>You can not shorten the deadline</p>
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
                id={paybackBtnActive ? '' : 'disabled'}
                onClick={paybackBtnActive ? paybackLoan : () => {}}
              >{paybackBtnText}</div>
            </div>}
            {loan!.lender === account ? <>
              {!loan!.active && loan!.lenderConfirmed ? <RevokeConfirmationSection/> : <div className={loan!.active && statusDetails![0] === 'Expired' ? '' : 'disabledSection'}>
                <h3>Claim Collateral</h3>
                <p>You can claim the tokens if the Loan has expired and the Lender has not paid back the Loan.</p>
                <div 
                  className="button submitButton dbButton" 
                  id={claimBtnActive ? '' : 'disabled'}
                  onClick={claimBtnActive ? claimCollateral : () => {}}
                >{claimBtnText}</div>
              </div>}
            </> : <RevokeConfirmationSection/>
            }
          </div> : <div/>}
        </div>
      </div>}
    </div>
  </>
}