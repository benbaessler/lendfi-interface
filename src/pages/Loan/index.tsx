import './style.css'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useParams, Redirect } from "react-router-dom"

interface RouteParams {
  id: string
}

interface UserProfile extends RouteComponentProps<RouteParams> {}

export const Loan: React.FC<RouteParams> = (props) => {
  const params = useParams<RouteParams>()
  const loanId = params.id

  console.log(loanId)

  // ! : Add Redirect for non-existing Loan ID.

  return <div>

  </div>
}