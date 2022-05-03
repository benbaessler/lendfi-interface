import { CollateralContext, useCollateralState } from "./collateral"

export const GlobalStore = ({ children }: any) => {
  const [collateral, setCollateral] = useCollateralState()

  return (
    <CollateralContext.Provider value={[collateral, setCollateral]}>
      {children}
    </CollateralContext.Provider>
  )
}

// Type 'AlchemyAPIToken[] | Dispatch<SetStateAction<AlchemyAPIToken[]>>' is not assignable to type 'AlchemyAPIToken'.
  // Type 'AlchemyAPIToken[]' is missing the following properties from type 'AlchemyAPIToken': balance, contract, description, id, and 5 more.