const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');


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
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            try {
                res.json(user)
            } catch (err) {
                res.json(err)
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Something Went Wrong')
        }

    })


module.exports = router