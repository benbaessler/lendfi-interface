import { createContext, useState } from 'react'

export const EnteredContext = createContext<any>(false)

export const useEnteredState = () => {
  const [entered, setEntered] = useState<boolean>(false)
  return [entered, setEntered]
}
