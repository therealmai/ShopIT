const{User} = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs'); //npm install bcryptjs
const jwt = require('jsonwebtoken'); //npm install jsonwebtoken
const router = express.Router();

router.get(`/`, async (req,res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success : false})
    }
    res.send(userList);
})



router.get(`/:id`, async (req,res) => {
    const userList = await User.findById(req.params.id).select('-passwordHash');

    if(!userList){
        res.status(500).json({success : false})
    }
    res.send(userList);
})
//Create User
router.post(`/`, async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('the user cannot be created');

    res.send(user);
});

//Login
router.post(`/login`, async(req,res) =>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send('User not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            {expiresIn : '1d'}
        )
        res.status(200).send({user: user.email, token: token})
    }else{
        res.status(400).send('Password is wrong');
    }
})

router.post(`/register`, async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('the user cannot be created');

    res.send(user);
});

module.exports = router;