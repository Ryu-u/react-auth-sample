import express from 'express'
import passport from 'passport'
import TwitterStrategy from 'passport-twitter'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()

passport.use(
  new TwitterStrategy.Strategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: `${process.env.REACT_APP_HOST}/auth/twitter/callback`,
    },
    (token, tokenSecret, user, done) => {
      // TODO: ここでアカウント検証もする

      // これがないとserializeUzerがうまくいかない
      done(null, user)
      // TODO: passportはuser情報を入れるが、profileの型が謎
    }
  )
)

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))
app.use(cookieParser())
app.use(passport.initialize())
app.use(session({ secret: 'SECRET' }))
app.use(passport.session())
app.use(express.static(path.join(__dirname, '../build')))

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/auth/twitter/success',
    failureRedirect: '/auth/twitter/failed',
  })
)

app.get('/auth/twitter/success', (req, res) => {
  const userInfo = req.session.passport.user
  // ここで本当はDBにアクセス
  const userId: number | null = null
  res.render('success', {
    user: {
      uuid: userInfo.id,
      provider: userInfo.provider,
      userId,
    },
    targetOrigin: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOST : '*',
  })
})

app.post('/create_user', (req, res) => {
  return res.status(201).json({userId: 1})
})

app.listen(process.env.PORT || 5000)
