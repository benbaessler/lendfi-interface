import './style.css'
import { useWeb3React } from '@web3-react/core'
import { utils } from 'ethers';
import getContract from '../../utils/getContract'
import { useEffect, useState } from 'react'
import { Loan } from '../../types/loan'
import { shortenAddress } from '../../utils'
import { getStatusDetails, formatDeadline } from '../../utils/loanDetails';
import { useHistory } from "react-router-dom";
import CollateralPopup from '../../components/ViewCollateral';
import { getToken } from '../../utils/tokens';
import { sortBy } from 'lodash'

/*
  Parameters:
  Type: (to/from)
  User
  Amount
  Collateral: View Popup
  Status
  Deadline
  Interest
  Dashboard button
*/

interface LoanComponentProps { data: Loan }

export default function Loans() {
  const { active, account, activate, library } = useWeb3React()
  const history = useHistory()
  const [loans, setLoans] = useState<Loan[]>([])

  const getLoans = async () => {
    const factoryContract = getContract(library.getSigner())
    // Change later
    const loans = await factoryContract.getSenderLoans()

    // Sort after deadline
    const activeLoans = loans.filter((loan: Loan) => !loan.executed)
    const expiredLoans = loans.filter((loan: Loan) => loan.executed)
    const sortedLoans = sortBy(activeLoans, "deadline").concat(sortBy(expiredLoans, "deadline"))

    setLoans(sortedLoans)
  }

  const formatUser = async (address: string): Promise<string> => {
    const ensName = await library.lookupAddress(address)
    const shortAddress = shortenAddress(address)

    if (ensName) return ensName
    return shortAddress
  }

  useEffect(() => { if (active) getLoans() }, [active])

  const LoanComponent = ({ data }: LoanComponentProps) => { 
    const formattedDeadline = formatDeadline(data.deadline)
    const [userDisplay, setUserDisplay] = useState<string>()
    const [status, statusColor] = getStatusDetails(data)
    const [showCollateral, setShowCollateral] = useState<boolean>(false)
    const [metadata, setMetadata] = useState()
    const [collatLoading, setCollatLoading] = useState<boolean>(true)

    const init = async () => {
      const _metadata = await getToken(data.collateral[0], Number(data.collateral[1]))
      setMetadata(_metadata)
      setCollatLoading(false)
    }

    useEffect(() => { init() }, [])

    return (
      <>
        <CollateralPopup data={metadata} show={showCollateral} onClose={() => setShowCollateral(false)} loading={collatLoading}/>
        <div className="loanContainer" onClick={() => history.push(`loan/${data.id}`)}>
          <div className="loanContentContainer">
            <div id="loansStatusInd" style={{ backgroundColor: statusColor }}/>
            <span id="c-1">{account === data.lender ? 'To' : 'From'}</span>
            <span id="c-2">{account === data.lender ? shortenAddress(data.borrower, 3) : shortenAddress(data.lender, 3)}</span>
            <span id="c-3">{utils.formatEther(data.amount)} ETH</span>
            <span id="c-4">{utils.formatEther(data.interest)} ETH</span>
            <span id="c-5" style={{ 
              opacity: status === 'Expired' ? .5 : 1
            }}>{formattedDeadline}</span>
          </div>
        </div>
      </>
    )
  }

  return <div className="interfaceContainer">
    <h1 id="loanUiTitle">Your Loans</h1>
    <div className="loanSectionTitle">
      <div style={{ width: '35px' }}/>
      <span id="c-1">Type</span>
      <span id="c-2">User</span>
      <span id="c-3">Amount</span>
      <span id="c-4">Interest</span>
      <span id="c-5">Deadline</span>
    </div>
    {loans.map((loan: Loan) => <LoanComponent data={loan}/>)}
  </div>
}