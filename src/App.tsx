import React from 'react'
import './App.css'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Top from './Top'
import SignUp from './SignUp'
import Auth from './Auth'
import Hoge from './Hoge'
import * as reactCookie from 'react-cookie'
import { CookieSetOptions } from 'universal-cookie'

export const authContext = React.createContext<{
  userIdState: string
  setUserIdState: React.Dispatch<React.SetStateAction<string>>
  setCookie: (name: string, value: any, options?: CookieSetOptions | undefined) => void
}>({ userIdState: '', setUserIdState: () => {}, setCookie: () => {} })

const App: React.FC = () => {
  const [cookies, setCookie, removeCookie] = reactCookie.useCookies(['userId'])
  const [userIdState, setUserIdState] = React.useState<string>('')

  React.useEffect(() => {
    if (cookies.userId !== null) {
      setUserIdState(cookies.userId)
    }
  }, [cookies.userId])
  return (
    <authContext.Provider value={{ userIdState, setUserIdState, setCookie }}>
      <BrowserRouter>
        <div>{userIdState}</div>
        <Switch>
          <Route exact path="/" component={Top} />
          <Route path="/sign_up" component={SignUp} />
          <Auth>
            <Switch>
              <Route exact path="/hoge" component={Hoge} />
            </Switch>
          </Auth>
        </Switch>
      </BrowserRouter>
    </authContext.Provider>
  )
}

export default App
