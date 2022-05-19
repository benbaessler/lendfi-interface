import './style.css'
import { useWeb3React } from '@web3-react/core'
import { providers, utils, Signer } from 'ethers';
import getContract from '../../utils/getContract'
import { useEffect, useState } from 'react'
import { Loan } from '../../types/loan'
import { shortenAddress } from '../../utils'
import { getStatusDetails, formatDeadline } from '../../utils/loanDetails';
import { useHistory } from "react-router-dom";

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
    setLoans(loans)
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

    const _setUserDisplay = async () => {
      let param: string
      if (account === data.lender) param = data.borrower
      else param = data.lender

      const response = await formatUser(param)
      setUserDisplay(response)
      console.log(response, userDisplay)
    }

    return (
      <>
        <div className="loanContainer" onClick={() => history.replace(`loan/${data.id}`)}>
          <div className="loanContentContainer">
            <div id="loansStatusInd" style={{ backgroundColor: statusColor }}/>
            <span id="c-1">{account === data.lender ? 'To' : 'From'}</span>
            <span id="c-2">{account === data.lender ? shortenAddress(data.borrower, 3) : shortenAddress(data.lender, 3)}</span>
            <span id="c-3">{utils.formatEther(data.amount)} ETH</span>
            <span id="c-4">{utils.formatEther(data.interest)} ETH</span>
            <span id="c-5" className="collateralViewBtn">View</span>
            <span id="c-6">{formattedDeadline.toLocaleString()}</span>
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
      <span id="c-5">Collateral</span>
      <span id="c-6">Deadline</span>
    </div>
    {loans.map((loan: Loan) => <LoanComponent data={loan}/>)}
  </div>
}