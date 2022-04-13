import './style.css'
import { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../connectors'
import TokenModal from '../../components/TokenModal'
import getTokens from '../../utils/getTokens'
import { AlchemyAPIToken, TokenCardProps } from '../../types'
import { CollateralContext } from '../../state/global'

export default function Create() {

  const { active, account, activate } = useWeb3React()

  // Role input
  const [role, setRole] = useState<string>()

  const [lender, setLender] = useState<string>()
  const [borrower, setBorrower] = useState<string>()

  const [borrowerTokens, setBorrowerTokens] = useState<AlchemyAPIToken[]>([])

  // Loan Amount input
  const [amountInput, setAmountInput] = useState()

  // Fix later
  const onAmountChange = (event: any) => {
    let input = event.target.value
    input.replace(',', '.')

    setAmountInput(input)
  }

  // Address input
  const [addressInput, setAddressInput] = useState()

  const onAddressChange = (event: any) => setAddressInput(event.target.value)

  // Collateral
  const [collateral, setCollateral] = useContext(CollateralContext)
  const [showModal, setShowModal] = useState<boolean>(false)

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  const submitLoan = async () => {

  }

  useEffect(() => {
    if (role == 'Lender') { 
      setLender(account as string) 
      setBorrower('')
    } else {
      setBorrower(account as string)
      setLender('')
    }
  }, [role])

  useEffect(() => {
    if (borrower) {
      // Update type!
      getTokens(borrower).then((tokens: any) => {
        setBorrowerTokens(tokens.ownedNfts)
      })
    } else setBorrowerTokens([])
  }, [borrower])

  const CollateralToken = ({ data }: TokenCardProps) => {
    return <div className="collatContainer">
      <img id="collatImage" src={data.media[0].gateway}/>
      <div className="collatInfo">
        <p>{data.title}</p>
        {/* <p id="floorPrice">{data.floor} ETH</p> */}
      </div>
    </div>
  }

  return <>
    {borrowerTokens.length > 0 ? <TokenModal 
      data={borrowerTokens}
      show={showModal} 
      onClose={() => setShowModal(false)}
    /> : <div/>}

    <div className="createContainer">

      <div className="createTopContainer">
        <h1>Create Loan</h1>
      </div>

      <div className="createContentContainer">  
        <div className="createSectionContainer">

          <div className="roleContainer">
            <h3>Select Role</h3>
            <div className="roleSelection">
              <div onClick={() => setRole('Lender')} className="button roleButton" id={role == 'Lender' ? 'roleSelected' : undefined}>
                Lender
              </div>
              <div onClick={() => setRole('Borrower')} className="button roleButton" id={role == 'Borrower' ? 'roleSelected' : undefined}>
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

          <div className="amountContainer">
            <h3>Interest Rate</h3>
            <div className="input">
              <input type="number" placeholder="0" value={amountInput} onChange={onAmountChange}/>
              %
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

          <div className="collateralContainer" id={borrower ? 'shown' : 'hidden'}>
            <div className="collateralTopSection">
              <div className="collateralTitle">
                <h3 style={{ margin: 0 }}>Collateral</h3>
                <h4>{`(${collateral.length})`}</h4> 
              </div>
              <div className="valueAddCollateral">
                <div 
                  className="addButton" 
                  onClick={borrower ? () => setShowModal(true) : () => {}}
                >
                  Add
                </div>
              </div>
            </div>
            <div className="collateralDisplay">
              {collateral.map((token: AlchemyAPIToken) => <CollateralToken data={token}/>)}
            </div>
          </div>

          <div className="button submitButton"
            onClick={active ? submitLoan : connectWallet}
            style={{ width: '100%' }}
          >{active ? 'Submit Loan' : 'Connect Wallet'}</div>

        </div>
      </div>
    </div>   
  </>
}