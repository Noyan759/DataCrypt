'use strict'

const express = require('express');
const router = express.Router();

const account = require('../service/DCAccountService');
var bcrypt = require('bcrypt');
const saltRounds = 10;

let validator;
let jwt;
module.exports.construct = function (body_parser,app) {
 console.log('test');
    validator=module.exports.validator;
    jwt=module.exports.jwt;

    router.post('/', function (req, res, next) {

        // find the user
        account.getByUsername(req.body.email, function (user) {


            if (!user) {
                res.json({success: false, message: 'Authentication failed. User not found.'});
            } else if (user) {

                // check if password matches
                bcrypt.compare(req.body.password, user.password).then(function(res) {
                    // res == true
                    if(!res)
                    {
                        res.json({success: false, message: 'Authentication failed. Wrong password.'});
                    }
                    else{
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
                });
            }

        });
    });
};
module.exports.router = router;
