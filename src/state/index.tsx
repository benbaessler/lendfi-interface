import { CollateralContext, useCollateralState } from "./collateral"
import { EnteredContext, useEnteredState } from "./entered"
import { NavigationContext, useNavigationState } from "./navigation"

export const GlobalStore = ({ children }: any) => {
  const [collateral, setCollateral] = useCollateralState()
  const [entered, setEntered] = useEnteredState()
  const [navSelection, setNavSelection] = useNavigationState()

  return (
    <EnteredContext.Provider value={[entered, setEntered]}>
      <NavigationContext.Provider value={[navSelection, setNavSelection]}>
        <CollateralContext.Provider value={[collateral, setCollateral]}>
          {children}
        </CollateralContext.Provider>
      </NavigationContext.Provider>
    </EnteredContext.Provider>
  )
}

// Type 'AlchemyAPIToken[] | Dispatch<SetStateAction<AlchemyAPIToken[]>>' is not assignable to type 'AlchemyAPIToken'.
  // Type 'AlchemyAPIToken[]' is missing the following properties from type 'AlchemyAPIToken': balance, contract, description, id, and 5 more.