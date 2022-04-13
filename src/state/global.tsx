import { createContext, useState } from 'react'
import { AlchemyAPIToken } from '../types'

export const CollateralContext = createContext<any[]>([])

export const GlobalStore = ({ children }: any) => {
  const [collateral, setCollateral] = useState<any[]>([])

  return (
    <CollateralContext.Provider value={[ collateral, setCollateral ]}>
        {children}
    </CollateralContext.Provider>
  )
}