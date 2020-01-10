```
 _____                                   ____  _     _      _     _
| ____|_  ___ __  _ __ ___  ___ ___     / ___|| |__ (_) ___| | __| |
|  _| \ \/ / '_ \| '__/ _ \/ __/ __|____\___ \| '_ \| |/ _ \ |/ _` |
| |___ >  <| |_) | | |  __/\__ \__ \_____|__) | | | | |  __/ | (_| |
|_____/_/\_\ .__/|_|  \___||___/___/    |____/|_| |_|_|\___|_|\__,_|
           |_|
```
#### Clean, simple OAuth2.0 with out-of-the-package support for Express

### Installation

`npm install express-shield` or `yarn add express-shield`

### Express

```js
const ExpressShield = require('express-shield').Express
const model = require('./model')
const shield = new ExpressShield({model})

...

app.use('/oauth/authorize', shield.authorize({
  authenticateHandler: {
    handle: (req,res) => {
      // Get User from request
      return myUser
    }
  }
}))
app.use('oauth/token', shield.token())

// Routes shielded by OAuth2.0
app.use('/secure/route', shield.authenticate())
app.use('/another/secure/route', shield.authenticate())
```

And that's it. Really.

See `example/express` for a real, working example of this

### Model

More coming soon.

See `example/model.js` for a concrete, working example
