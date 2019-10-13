import React from 'react'
import { Redirect } from 'react-router-dom'
import { authContext } from './App'
import * as reactCookie from 'react-cookie'

const Auth: React.FC = ({ children }) => {
  const con = React.useContext(authContext)
  const [cookies, setCookie, removeCookie] = reactCookie.useCookies(['userId'])
  return <>{cookies.userId ? <>{children}</> : <Redirect to={'/'} />}</>
}

export default Auth
