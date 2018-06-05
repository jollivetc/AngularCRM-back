const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

//server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

const SECRET_KEY = '123456789';
const expiresIn = '1h';

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.find(user => user.email === email && user.password === password)
}

server.post('/auth/login', (req, res) => {
  console.log("got a query auth");
  const {email, password} = req.body
  const user = isAuthenticated({email, password});
  if (user == false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }
  const userToReturn = {id: user.id,firstname: user.firstname, lastname: user.lastname, email: email};
  const access_token = createToken(userToReturn)
  res.status(200).json({token: access_token, user: userToReturn })
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  console.log("got a query not auth");
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Bad authorization header'
    res.status(status).json({status, message})
    return
  }
  try {
     verifyToken(req.headers.authorization.split(' ')[1])
     if (req.method === 'POST') {
      req.body.createdAt = Date.now()
     }
     if (req.method === 'PUT') {
      req.body.updatedAt = Date.now()
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error: access_token is not valid'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(3000, () => {
  console.log('Run Auth API Server')
})


