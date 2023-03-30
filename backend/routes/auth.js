const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router()
var jwt = require('jsonwebtoken');


const JWT_SECRET = 'Harryisagoodb$oy'


//create a User using POST "api/auth/crteateuser" login req  
router.post('/createuser',
[ 
    body('name', 'Please enter a valid name').isLength({ min: 2 }),
    body('password','Password must be 5 charcters longer').isLength({ min: 5 }),
    body('email', 'Please enter a valid email').isEmail()
], 
   async (req, res) =>{

    //if there are errors, return bad req and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
try {

  //if same email then throw errors
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: 'sorry a user with this email already exists'})
    }

    //for encrypted password with hash and salt
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);


    //to create a new user
    user = await User.create({
        name: req.body.name,
        password:secPass ,
        email: req.body.email,
      })  


      //if everything is fine then send the response to the user in return after login
      const data = {
        // after login it mathes the userid then gives the response
        user:{
          id:user.id
        }
      }
      //jwt sign is method to see the signature or we can say the it matches the unique user id
      const authToken = jwt.sign(data, JWT_SECRET)
      res.status(200).json({authToken})

      //if some error comes then throw the error
    } catch (error) {
  console.error(error.message);
  res.status(500).send("Something went wrong")
    }
    })

module.exports = router

 