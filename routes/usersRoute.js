const express = require("express");
const userModel = require("../models/usersModel.js");
const {generateToken} = require("../auth/auth.js");

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
    try {

        const {name, email, password} = req.body;

        // const user = await userModel.create({
        //     name, email, password
        // })

        try {
            
            const user = await userModel.create({
                name, email, password
            })

        }catch(e){
            // console.log(e.errors.password.properties.message)
            let errors = [];
            for(let key of Object.keys(e.errors)){
                let field = e.errors[key]
                errors.push(field.properties.message)
            }
            return res.status(400).json({message : errors})
        }

        if(user){
            res.status(201).json({message : "created user"});
        }else{
            res.status(400).json({message : "faild to create user"});
        }

    } catch(error){
        console.log(error)
        res.status(500).json({message : "an error occured!"});
    }
})

usersRouter.post("/login", async (req, res) => {
    try {

        const {email, password} = req.body;

        const user = await userModel.findOne({
            email
        })

        if(!user) return res.status(400).json({message : "user does not exist"});        

        // verify password
        if((await user.validatePassword(password) == false)) 
            return res.status(403).json({message : "incorrect password!"})

        // create token
        const payload = {
            _id : user.id            
        }

        const token = generateToken(payload);

        // return res.sta;tus(200).json({
        //     token
        // })
        res.cookie('token', token, {httpOnly : false});
        return res.sendStatus(200)

    } catch(error){
        console.log(error)
        return res.status(500).json({message : "an error occured!"});
    }
});

usersRouter.post("/logout", async (req, res) => {
    try {

        if(req.cookies.token){
            res.clearCookie("token");
            return res.sendStatus(200);
        }else{
            return res.sendStatus(400);
        }

    } catch(error){
        console.log(error)
        return res.status(500).json({message : "an error occured!"});
    }
});

module.exports = usersRouter;