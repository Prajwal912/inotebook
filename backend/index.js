const connectToMongo = require('./db')
const express = require('express')
connectToMongo();


const app = express()
const port = 5000;

app.use(express.json());

//for user signup, login, ang get user details using JWT token
app.use('/api/auth', require('./routes/auth'))

//CRUD operation
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})