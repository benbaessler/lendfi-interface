import { Contract, Signer } from 'ethers'
import { factoryAddress } from "../constants"
import LendFiABI from '../abis/LendFi.json'

export default function getContract(signer: Signer) {
  const factoryContract = new Contract(factoryAddress, LendFiABI.abi, signer) 
  return factoryContract
}
