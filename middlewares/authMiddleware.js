const express = require('express');
const router = express.Router();

const account = require('../models/DCAccountManagement');

let jwt;
let app;

module.exports=function(req, res, next) {
    console.log('3434');
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        jwt = module.exports.jwt;
        app = module.exports.app;
        // decode token
        if (token) {
    
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
    
        } else {
    
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
    
        }
    };