import { Contract, providers } from 'ethers'
import { factoryAddress } from "../constants"
import LoanFactoryABI from '../artifacts/contracts/LoanFactory.sol/LoanFactory.json'

export default function getContract(signer: providers.JsonRpcSigner) {
  const factoryContract = new Contract(factoryAddress, LoanFactoryABI.abi, signer) 
  return factoryContract
}
