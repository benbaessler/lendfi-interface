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

export default function Create() {
  const { active, account, activate, library } = useWeb3React()

  // Role input
  const [role, setRole] = useState<string>()

  const [lender, setLender] = useState<string>()
  const [borrower, setBorrower] = useState<string>()
  const [borrowerTokens, setBorrowerTokens] = useState<AlchemyAPIToken[] | boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(true)

  // Input
  const [amountInput, setAmountInput] = useState<string>()
  const [interestInput, setInterestInput] = useState<string>()
  const [deadlineInput, setDeadlineInput] = useState()
  const [addressInput, setAddressInput] = useState<string>()

  // Collateral
  const [collateral] = useContext(CollateralContext)
  const [showModal, setShowModal] = useState<boolean>(false)

  const onDeadlineChange = (event: any) => setDeadlineInput(event.target.value)
  
  const onAddressChange = (event: any) => {
    const input = event.target.value
    if (role === 'Lender') {
      setBorrower(input)
    } else { setLender(input) }
  }

  // Fix later
  const onAmountChange = (event: any) => {
    let input = event.target.value
    input.replace(',', '.')

    setAmountInput(input)
  }

  const onInterestChange = (event: any) => {
    setInterestInput(event.target.value)
  }

  const connectWallet = async () => {
    try { await activate(injected) }
    catch (error) { console.error(error) }
  }

  const submitLoan = async () => {
    const factoryContract = getContract(library.getSigner())
    // Parsing input data
    const amountInWei = BigNumber.from(Number(utils.parseEther(amountInput as string)).toString())
    const interestFee = BigNumber.from((Number(amountInWei) * Number(interestInput) / 100).toString())
    const parsedCollateral: TokenStruct[] = collateral.map((token: AlchemyAPIToken) => ({
      contractAddress: token.contract.address,
      tokenId: Number(token.id.tokenId)
    }))
    const unixDeadline = Math.round((new Date(deadlineInput!)).getTime() / 1000)

    await factoryContract.submitLoan(lender, borrower, amountInWei, interestFee, parsedCollateral[0], unixDeadline)
    console.log('Successfully submitted a new loan')
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
        console.log(borrowerTokens)
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
          onClick={active ? submitLoan : connectWallet}
        >{active ? 'Submit Loan' : 'Connect Wallet'}</div>
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
              <input type="number" placeholder="0" value={interestInput} onChange={onInterestChange}/>
              %
            </div>
          </div>

          <div className="deadlineContainer">
            <h3>Deadline</h3>
            <div className="input" style={{ marginBottom: '12px' }}>
              <input type="datetime-local" value={deadlineInput} onChange={onDeadlineChange}/>
            </div>
            <p>Note that the lender can extend the deadline at any time.</p>
          </div>

        </div>

        <div className="createSectionContainer">

          <div className="addressContainer">
            <h3>{role == 'Lender' ? 'Borrower Address' : 'Lender Address'}</h3>
            <div className="input">
              <input type="text" 
                value={role === 'Lender' ? borrower : lender} 
                onChange={onAddressChange}/>
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