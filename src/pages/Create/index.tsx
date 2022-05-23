import './style.css'
import { useState, useEffect, useContext } from 'react';
import { utils, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../connectors'
import TokenModal from '../../components/TokenModal'
import { getTokens } from '../../utils/tokens'
import { AlchemyAPIToken, TokenCardProps, TokenStruct } from '../../types'
import { CollateralContext } from '../../state/collateral'
import getContract from '../../utils/getContract';
import CheckmarkIcon from '../../assets/icons/checkmark.png'
import InvalidIcon from '../../assets/icons/invalid.png'
import { isAddress } from '../../utils'

export default function Create() {
  const { account,library } = useWeb3React()

  // Role input
  const [role, setRole] = useState<string>()

  const [lender, setLender] = useState<string>()
  const [borrower, setBorrower] = useState<string>()
  const [borrowerTokens, setBorrowerTokens] = useState<AlchemyAPIToken[] | boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(true)

  // Input
  const [amountInput, setAmountInput] = useState<string>()
  const [interestInput, setInterestInput] = useState<string>()
  const [deadlineInput, setDeadlineInput] = useState<any>()

  // Address input + checker
  const [addressInput, setAddressInput] = useState<string>()
  const [addressValid, setAddressValid] = useState<boolean>(false)
  const [addressChecked, setAddressChecked] = useState<boolean>(false)

  // Collateral
  const [collateral, setCollateral] = useContext(CollateralContext)
  const [showModal, setShowModal] = useState<boolean>(false)

  // Submit button
  const [submitBtnText, setSubmitBtnText] = useState<string>('Submit Loan')
  const [submitBtnActive, setSubmitBtnActive] = useState<boolean>(true)

  const submitLoan = async () => {
    setSubmitBtnText('Submitting...')
    setSubmitBtnActive(false)

    try {
      const factoryContract = getContract(library.getSigner())
  
      // Parsing input data
      const amountInWei = BigNumber.from(Number(utils.parseEther(amountInput as string)).toString())
      const interestFee = BigNumber.from((Number(amountInWei) * Number(interestInput) / 100).toString())
      const parsedCollateral: TokenStruct[] = collateral.map((token: AlchemyAPIToken) => ({
        contractAddress: token.contract.address,
        tokenId: Number(token.id.tokenId)
      }))
      const unixDeadline = Math.round((new Date(deadlineInput!)).getTime() / 1000)
  
      await factoryContract.submitLoan(lender, borrower, amountInWei, interestFee, parsedCollateral[0], unixDeadline).then(() => {
        // Clearing inputs
        setSubmitBtnActive(true)
        setSubmitBtnText('Submit Loan')
        setRole('')
        setAmountInput('')
        setInterestInput('')
        setDeadlineInput(0)
        setAddressInput('')
        setCollateral([])
      })
    } catch (error) {
      setSubmitBtnText('Failed')
      setSubmitBtnActive(true)
      setTimeout(() => setSubmitBtnText('Submit Loan'), 1000)
    }
  }

  useEffect(() => {
    if (role === 'Lender') { 
      setLender(account as string) 
      setBorrower('')
    } else {
      setBorrower(account as string)
      setLender('')
    }
  }, [role])

  useEffect(() => {
    if (borrower) {
      setModalLoading(true)
      getTokens(borrower).then((tokens: AlchemyAPIToken[]) => {
        setBorrowerTokens(tokens)
        setModalLoading(false)
      })
    } else setBorrowerTokens([])
  }, [borrower])

  useEffect(() => {
    if (['', undefined].includes(addressInput)) { 
      setAddressChecked(false)
      return
    }

    const acTimeout = setTimeout(() => {
      setAddressChecked(true)
      setAddressValid(isAddress(addressInput!))
    }, 2000)

    return () => clearTimeout(acTimeout)
  }, [addressInput])

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
    <TokenModal 
      data={borrowerTokens}
      show={showModal} 
      onClose={() => setShowModal(false)}
      loading={modalLoading}
    />

    <div className="interfaceContainer createWrapper">

      <div className="topContainer">
        <h1>Create Loan</h1>
        <div className="button submitButton"
          id={!submitBtnActive ? 'disabled' : ''}
          onClick={submitBtnActive ? submitLoan : () => {}}
        >{submitBtnText}</div>
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
              <input 
                type="number"
                pattern="/^\d*\.?\d*$/"
                placeholder="0" 
                min="0"
                value={amountInput} 
                onChange={event => setAmountInput(event.target.value)}
              />
              ETH
            </div>
          </div>

          <div className="amountContainer">
            <h3>Interest Rate</h3>
            <div className="input">
              <input type="number" min="0" placeholder="0" value={interestInput} onChange={event => setInterestInput(event.target.value)}/>
              %
            </div>
          </div>

          <div className="deadlineContainer">
            <h3>Deadline</h3>
            <div className="input" style={{ marginBottom: '12px' }}>
              <input type="datetime-local" value={deadlineInput} onChange={event => setDeadlineInput(event.target.value)}/>
            </div>
            <p>Note that the lender can extend the deadline at any time.</p>
          </div>

        </div>

        <div className="createSectionContainer">

          <div className="addressContainer">
            <h3>{role == 'Lender' ? 'Borrower Address' : 'Lender Address'}</h3>
            <div className="input">
              <input type="text" 
                value={addressInput}
                onChange={event => setAddressInput(event.target.value)}
                style={{ paddingRight: '10px' }}
              />
              <img 
                src={addressValid ? CheckmarkIcon : InvalidIcon}
                style={{ display: addressChecked ? '' : 'none' }}
              />
            </div>
          </div>

          <div className="collateralContainer" id={borrower ? 'shown' : 'hidden'}>
            <div className="collateralTopSection">
              <h3 style={{ margin: 0 }}>Collateral</h3>
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
        </div>
      </div>
    </div>   
  </>
}