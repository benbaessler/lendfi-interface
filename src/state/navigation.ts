import { createContext, useState } from 'react'

export const NavigationContext = createContext<any>('')

export const useNavigationState = () => {
  const [navSelection, setNavSelection] = useState<string>('')
  return [navSelection, setNavSelection]
}
