import './style.css'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useParams, Redirect } from "react-router-dom"
import getContract from '../../utils/getContract'
import { useWeb3React } from '@web3-react/core'
import { Loan } from '../../types/loan'
import { formatDeadline, getStatusDetails } from '../../utils/loanDetails'
import { Spinner } from 'react-bootstrap'
import { shortenAddress } from '../../utils'
import { utils } from 'ethers'

interface RouteParams {
  id: string
}

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const LoanPage: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const loanId = params.id

  const [loading, setLoading] = useState<boolean>(true)

  const { active, library } = useWeb3React()
  const [loan, setLoan] = useState<Loan>()

  // Loan Details
  const [statusDetails, setStatusDetails] = useState<string[]>()

  const init = async () => {
    const factoryContract = getContract(library.getSigner())
    const _loan = await factoryContract.getLoan(loanId)
    setLoan(_loan)

    const _statusDetails = getStatusDetails(_loan)
    setStatusDetails(_statusDetails)

    setLoading(false)
  }

  useEffect(() => { if (active) init() }, [active])

  // ! : Add Redirect for non-existing Loan ID.

  return <div className="interfaceContainer dashboardWrapper">
    {loading ? <Spinner animation="border" variant="light" style={{
      position: 'absolute',
      right: '50%',
      bottom: '50%',
    }}/> : <div>
      <div className="dbTitleContainer">
        <h1 id="dbTitle">Manage Loan</h1>
        <div className="statusContainer">
          <div id="statusIndicator" style={{ backgroundColor: statusDetails![1] }}/>
          <span id="statusTitle">{statusDetails![0]}</span>
        </div>
      </div>
      <div className="dbDetailsContainer">
        <div className="dbDetailSection">
          <h3>Lender</h3>
          <h4>{shortenAddress(loan!.lender)}</h4>
        </div>
        <div className="dbDetailSection">
          <h3>Borrower</h3>
          <h4>{shortenAddress(loan!.borrower)}</h4>
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
      </div>
    </div> }
  </div>
}