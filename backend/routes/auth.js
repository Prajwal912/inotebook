const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router()


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

    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: 'sorry a user with this email already exists'})
    }
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })  
      res.status(200).json({"Nice":"nice"})
    })

module.exports = router

 