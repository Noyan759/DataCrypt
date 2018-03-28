'use strict'

const express = require('express');
const router = express.Router();

const account = require('../models/DCAccountManagement');


let validator;
let jwt;
module.exports.construct = function (body_parser,app) {
 console.log('test');
    validator=module.exports.validator;
    jwt=module.exports.jwt;

    router.post('/', function (req, res, next) {

        // find the user
        account.getByEmail(req.body.email)
            .then(function (user) {


            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password matches
                if (user.password !== req.body.password) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token
                    console.log("REACHED");
                    let dateToday = new Date();

                    let userDetails ={
                        email: user.email,
                        password: user.password,
                        dateToday: dateToday
                    };
                    console.log(userDetails);

                    let token = jwt.sign(userDetails, app.get('superSecret'), {
                        // expiresIn: 60*60*24 // expires in 12 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        id: user.id

                    });

                }

            }

        });
    });
};
module.exports.router = router;
