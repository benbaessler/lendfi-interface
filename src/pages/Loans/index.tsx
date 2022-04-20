import './style.css'
import { useWeb3React } from '@web3-react/core'
import { providers, utils } from 'ethers'
import { getContract } from '../../utils/contract'
import { useEffect, useState } from 'react'
import { Loan } from '../../types/loan'

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
  const { active, library, account } = useWeb3React()
  let provider: providers.Web3Provider
  let signer: providers.JsonRpcSigner
  const [hasSigner, setHasSigner] = useState<boolean>(false)

  const [loans, setLoans] = useState<Loan[]>([])

  const _getLoan = async () => {
    const factoryContract = getContract(signer)
    const loan = await factoryContract.getLoan(0)
    setLoans([loan])
  }

  useEffect(() => {
    if (active) {
      provider = new providers.Web3Provider(library.provider)
      signer = provider.getSigner()
      _getLoan()
    }
  }, [active])

  useEffect(() => {

  }, [hasSigner])

  const LoanComponent = ({ data }: LoanComponentProps) => {    
    const formattedDeadline = new Date(data.deadline * 1000)

    let status: string
    let statusColor: string

    if (data.active) {
      status = 'Active'
      statusColor = '#14c443'
    } else if (data.executed) {
      status = 'Executed'
      statusColor = '#ff0000'
    } else {
      status = 'Initialized'
      statusColor = 'white'
    }

    return (
      <div className="loanContainer">
        <div className="loanContentContainer">
          <p>{account === data.lender ? 'To' : 'From'}</p>
          <p>{account === data.lender ? data.borrower : data.lender}</p>
          <p>{utils.formatEther(data.amount)} ETH</p>
          <p>{utils.formatEther(data.interest)}</p>
          <p id="collateralViewBtn">View</p>
          <p style={{ color: statusColor }}>{status}</p>
          <p>{formattedDeadline.toLocaleString()}</p>
        </div>
      </div>
    )
  }

  return <div className="interfaceContainer">
    <h1 id="loanUiTitle">Your Loans</h1>
    <div className="loanSectionTitle">
      <p>Type</p>
      <p>User</p>
      <p>Amount</p>
      <p>Interest</p>
      <p>Collateral</p>
      <p>Status</p>
      <p>Deadline</p>
    </div>
    {loans.map((loan: Loan) => <LoanComponent data={loan}/>)}
  </div>
}