import './style.css'
import { useWeb3React } from '@web3-react/core'
import { providers, Contract } from 'ethers'
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
  const { active, library } = useWeb3React()
  let provider: providers.Web3Provider
  let signer: providers.JsonRpcSigner

  const [loans, setLoans] = useState<Loan[]>()

  const _getLoan = async () => {
    const factoryContract = getContract(signer)
    const loan = await factoryContract.getLoan(0)
    console.log(loan)
  }

  useEffect(() => {
    if (active) {
      provider = new providers.Web3Provider(library.provider)
      signer = provider.getSigner()
      // _getLoan()
    }
  }, [active])
  const LoanComponent = () => <div className="loanContainer">
    <div className="loanContentContainer">
      <p>Type</p>
      <p>User</p>
      <p>Amount</p>
      <p>Interest</p>
      <p>Collateral</p>
      <p>Status</p>
      <p>Deadline</p>
    </div>
  </div>

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
    <LoanComponent/>
  </div>
}