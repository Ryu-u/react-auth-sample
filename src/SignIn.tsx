import * as React from 'react'
import * as reactCookie from 'react-cookie'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import useReactRouter from 'use-react-router'
import { authContext } from './App'

const SignIn: React.FC = () => {
  const [cookies, setCookie, removeCookie] = reactCookie.useCookies(['test'])
  const { history, location, match } = useReactRouter()
  const userIdContext = React.useContext(authContext)

  const nameRef = React.useRef<HTMLInputElement>(null)
  return(
    <>
    { !cookies.hasOwnProperty('test') || cookies.userId ?
    <Redirect to={'/'}/>
    :
    <form>
      <input ref={nameRef} />
      <button onClick={e => {
        e.preventDefault()
        e.stopPropagation()

        const ref = nameRef.current
        if(ref) {
          axios.post('/create_user', {name: ref.value})
          .then(response => {
            console.log('OK')
            removeCookie('test')
            setCookie('userId', response.data.userId)
            userIdContext.setUserIdState(response.data.userId)
            history.push('/hoge')
          })
          .catch(e => console.log(e))
        }
      }}>登録</button>
    </form>
    }
    </>
  )
}

export default SignIn
