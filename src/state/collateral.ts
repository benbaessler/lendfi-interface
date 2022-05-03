import { createContext, useState } from 'react'
import { AlchemyAPIToken } from '../types'

export const CollateralContext = createContext<any>([])

export const useCollateralState = () => {
  const [collateral, setCollateral] = useState<AlchemyAPIToken[]>([])
  return [collateral, setCollateral]
}
