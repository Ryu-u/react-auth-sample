import * as React from 'react'
import { authContext } from './App'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import * as reactCookie from 'react-cookie'

const logInTab = () => {
  const authWindow = window.open(`${process.env.REACT_APP_HOST}/auth/twitter`, 'auth', 'height=600,width=600')!
  const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
  // window 使ってts7015fgが出たら、これを使う↓
  const eventer = (window as { [key: string]: any })[eventMethod]
  const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
  const authPromise = new Promise<{ data: string }>((resolve, reject) => {
    eventer(
      messageEvent,
      (msg: any) => {
        if (msg.origin !== process.env.REACT_APP_HOST) {
          authWindow.close()
          reject(`${msg.origin}\n${process.env.REACT_APP_HOST}`)
        }

        if (msg) {
          authWindow.close()
          resolve(msg)
        }
      },
      false
    )
  })

  return authPromise
}

const Top: React.FC = () => {
  const con = React.useContext(authContext)
  const history = useHistory()
  const [cookies, setCookie, removeCookie] = reactCookie.useCookies(['userId'])
  return (
    <div>
      <div>TOP!!!!</div>
      <button
        onClick={e => {
          e.preventDefault()
          const p = logInTab()
          p.then(res => {
            const userInfo: { uuid: string; provider: 'twitter'; userId: string | null } = JSON.parse(res.data)
            console.log(res.data)
            if (userInfo.userId) {
              con.setCookie('userId', userInfo.userId, {
                maxAge: 300,
              })
              con.setUserIdState(userInfo.userId)
              history.push('/hoge')
            } else {
              history.push('/sign_up')
            }
          }).catch(e => {
            console.log(e)
          })
        }}
      >
        Twitterでログイン
      </button>
      <br />
      <button
        onClick={e => {
          e.preventDefault()
          removeCookie('userId')
          history.push('/')
        }}
      >
        ログアウト
      </button>
      <Link to="/hoge">Hogeへ</Link>
    </div>
  )
}

export default Top
