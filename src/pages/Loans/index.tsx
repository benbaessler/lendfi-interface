import './style.css'
import { useWeb3React } from '@web3-react/core'
import { providers, utils, Signer } from 'ethers';
import getContract from '../../utils/getContract'
import { useEffect, useState } from 'react'
import { Loan } from '../../types/loan'
import { shortenAddress } from '../../utils'
import { getStatusDetails, formatDeadline } from '../../utils/loanDetails';

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
        <div className="loanContainer">
          <div className="loanContentContainer">
            <p id="c-1">{account === data.lender ? 'To' : 'From'}</p>
            <p id="c-2">{account === data.lender ? shortenAddress(data.borrower, 3) : shortenAddress(data.lender, 3)}</p>
            <p id="c-3">{utils.formatEther(data.amount)} ETH</p>
            <p id="c-4">{utils.formatEther(data.interest)} ETH</p>
            <p id="c-5" className="collateralViewBtn">View</p>
            <p style={{ color: statusColor }} id="c-6">{status}</p>
            <p id="c-7">{formattedDeadline.toLocaleString()}</p>
          </div>
        </div>
      </>
    )
  }

  return <div className="interfaceContainer">
    <h1 id="loanUiTitle">Your Loans</h1>
    <div className="loanSectionTitle">
      <p id="c-1">Type</p>
      <p id="c-2">User</p>
      <p id="c-3">Amount</p>
      <p id="c-4">Interest</p>
      <p id="c-5">Collateral</p>
      <p id="c-6">Status</p>
      <p id="c-7">Deadline</p>
    </div>
    {loans.map((loan: Loan) => <LoanComponent data={loan}/>)}
  </div>
}