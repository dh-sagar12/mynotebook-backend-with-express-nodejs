const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const jwt = require('jsonwebtoken');

const JWT_TOKEN = process.env.JWT_SECRET_KEY


// creating router


//ROUTE 1: FOR CREATING USER
router.post('/createuser/',
    // validating email name and password 
    [
        body('name', "Names less than three characters are considered as invalid name").isLength({ min: 3 }),
        body('email', "Please Enter valid name").isEmail(),
        body('password', "Password must be atleast Five Characters long").isLength({ min: 5 })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //checking if email already exist or not
        try {

            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ error: "User already Exist with this email." })
            }
            // creating user if user with same email not exist 
            const salt = bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })
            const jwtData = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(jwtData, JWT_TOKEN)

            res.json({ authtoken })


        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error')
        }

    })



//ROUTE 2: FOR AUTHENTICATING USER: LOGGING NOT REQUIRED
router.post('/login/',
    // validating email name and password 
    [
        body('email', "Please Enter valid name").isEmail(),
        body('password', "Password cannot be blank").exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //checking for user having above credentials
        const { email, password } = req.body
        try {

            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: "Invalid Login Credentials" })
            }
            // logging if credentials matched
            const passwordCompare = await bcrypt.compare(password, user.password)

            if (!passwordCompare) {
                return res.status(400).json({ error: "Invalid Login Credentials" })
            }
            const Data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(Data, JWT_TOKEN)

            res.json({ authtoken })


        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error')
        }

    })


module.exports = router