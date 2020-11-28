const User = require('../model/userModel')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {JWT_TOKEN}=require('../config/keys')

module.exports = {
    register(req, res, next) {
        let {
            name,
            email,
            password,
            confirmPassword
        } = req.body
        if (!name || !email || !password || !confirmPassword) {
            return res.status(401).json({
                error: 'Please provide all information'
            })
        }
        if (password.length < 6) {
            return res.status(401).json({
                error: 'Password must be at least 6 characters'
            })
        }
        if (password != confirmPassword) {
            return res.status(401).json({
                error: 'Password not matched'
            })
        }
        User.findOne({
                email
            })
            .then(result => {
                if (result) {
                    return res.status(401).json({
                        error: 'Email already exists'
                    })
                }
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        return res.status(404).json({
                            error: 'Server error'
                        })
                    }
                    const user = new User({
                        name,
                        email,
                        password: hash
                    })
                    user.save()
                        .then(result => {
                            return res.status(201).json({
                                text: 'Registration successful'
                            })
                        })
                        .catch(err => {
                            return res.status(404).json({
                                error: 'Server error'
                            })
                        })

                });
            })
            .catch(err => {
                console.log(err)
            })
    },




    login(req, res, next) {
        let {

            email,
            password,

        } = req.body
        if (!email || !password) {
            return res.status(401).json({
                error: 'Please provide all information'
            })
        }
        User.findOne({
                email
            })
            .then(userInfo => {
                // console.log(userInfo)
                if (!userInfo) {
                    return res.status(401).json({
                        error: 'Invalid email'
                    })
                }
                bcrypt.compare(password,userInfo.password, function (err, result) {
                    if (!result) {
                        return res.status(401).json({
                            error: 'Password not matched'
                        })
                    }
                    const user={
                        _id:userInfo._id,
                        name:userInfo.name,
                        email:userInfo.email
                    }
                    
                    var token = jwt.sign({ _id: userInfo._id,
                    name: userInfo.name }, JWT_TOKEN);
                    return res.status(201).json({
                        text: 'Login success',
                        token,
                        user
                    })

                });
            })
            .catch(err => {
                console.log(err)
            })
    }
}