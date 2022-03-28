import './style.css'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../connectors'
import TokenModal from '../../components/TokenModal'

export default function Create() {

  const { active, account, activate } = useWeb3React()

  // Role input
  const [role, setRole] = useState()

  const [lender, setLender] = useState()
  const [borrower, setBorrower] = useState()

  useEffect(() => {
    if (role == 'Lender') { 
      setLender(account) 
      setBorrower('')
    } else {
      setBorrower(account)
      setLender('')
    }
  }, [role])

  // Loan Amount input
  const [amountInput, setAmountInput] = useState()

  const onAmountChange = event => {
    let input = event.target.value
    input.replace(',', '.')

    setAmountInput(input)
  }

  // Address input
  const [addressInput, setAddressInput] = useState()

  const onAddressChange = event => setAddressInput(event.target.value)

  // Collateral
  const [collateral, setCollateral] = useState()
  const [showModal, setShowModal] = useState(false)

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  const submitLoan = async () => {

  }

  return <>
    <TokenModal address={borrower} show={showModal} onClose={() => setShowModal(false)}/>

    <div className="createContainer">

      <div className="createTopContainer">
        <h1>Create Loan</h1>
        <div className="button submitButton"
          onClick={active ? submitLoan : connectWallet}
        >{active ? 'Submit Loan' : 'Connect Wallet'}</div>
      </div>

      <div className="createContentContainer">  
        <div className="createSectionContainer">

          <div className="roleContainer">
            <h3>Select Role</h3>
            <div className="roleSelection">
              <div onClick={() => setRole('Lender')} className="button roleButton" id={role == 'Lender' ? 'roleSelected' : ''}>
                Lender
              </div>
              <div onClick={() => setRole('Borrower')} className="button roleButton" id={role == 'Borrower' ? 'roleSelected' : ''}>
                Borrower
              </div>
            </div>
          </div>

          <div className="amountContainer">
            <h3>Loan Amount</h3>
            <div className="input">
              <input type="number" placeholder="0" value={amountInput} onChange={onAmountChange}/>
              ETH
            </div>
          </div>

          <div className="deadlineContainer">
            <h3>Deadline</h3>
            <div className="input" style={{ marginBottom: '12px' }}>
              <input type="datetime-local"/>
            </div>
            <p>Note that the lender can extend the deadline at any time.</p>
          </div>

        </div>

        <div className="createSectionContainer">

          <div className="addressContainer">
            <h3>{role == 'Lender' ? 'Borrower Address' : 'Lender Address'}</h3>
            <div className="input">
              <input type="text" value={addressInput} onChange={onAddressChange}/>
            </div>
          </div>

          <div className="collateralContainer">
            <div className="collateralTopSection">
              <h3>Collateral</h3>
              <div className="valueAddCollateral">
                <div className="addButton" onClick={() => setShowModal(true)}>
                  Add
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>   
  </>
}