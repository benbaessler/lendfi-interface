import { Contract, Signer } from 'ethers'
import { factoryAddress } from "../constants"
import LoanFactoryABI from '../artifacts/contracts/LoanFactory.sol/LoanFactory.json'

export default function getContract(signer: Signer) {
  const factoryContract = new Contract(factoryAddress, LoanFactoryABI.abi, signer) 
  return factoryContract
}
