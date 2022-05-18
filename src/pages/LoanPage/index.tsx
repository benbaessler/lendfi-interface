import './style.css'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useParams, Redirect } from "react-router-dom"
import getContract from '../../utils/getContract'
import { useWeb3React } from '@web3-react/core'
import { Loan } from '../../types/loan'
import { getStatusDetails } from '../../utils/loanDetails'

interface RouteParams {
  id: string
}

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const LoanPage: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const loanId = params.id

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
  }

  useEffect(() => { if (active) init() }, [active])

  // ! : Add Redirect for non-existing Loan ID.

  return <div className="interfaceContainer dashboardWrapper">
    <div className="dbTitleContainer">
      <h1 id="dbTitle">Manage Loan</h1>
      <div className="statusContainer">
        <div id="statusIndicator" style={{ backgroundColor: statusDetails ? statusDetails[1] : 'rgba(256, 256, 256, .5)' }}/>
        <span 
          id="statusTitle"
          style={{ opacity: statusDetails ? 1 : .5 }}
        >{statusDetails ? statusDetails[0] : 'Loading...'}</span>
      </div>
    </div>
  </div>
}