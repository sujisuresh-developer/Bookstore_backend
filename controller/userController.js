const users = require("../model/userModel");
const jwt = require('jsonwebtoken');

//register

exports.registerController = async (req, res) => {
    console.log(`inside register controller`);
    const { username, password, email } = req.body
    console.log(username, password, email);

    //logic  //users from model  //usrname:username
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(404).json(`User Already Exists.. Please Login!!`)

        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


//login
exports.loginController = async (req, res) => {
    console.log(`inside login controller`);
    const { password, email } = req.body
    console.log(password, email);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email,role:existingUser.role }, process.env.JWTSecretKey)
                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json(`invalid credentials!!`)
            }
        } else {
            res.status(404).json(`User not found ..please register`)

        }
    } catch (error) {
        res.status(500).json(error)
    }
}



//google login

exports.googleloginController = async (req, res) => {
    console.log(`inside login controller`);
    const { password, email,username,profile } = req.body
    console.log(password, email,username,profile);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email,role:existingUser.role }, process.env.JWTSecretKey)
                res.status(200).json({ existingUser, token })
           
        } else {
            const newUser = new users({
                username,
                email,
                password,
                profile
            })
             await newUser.save()
            const token = jwt.sign({ userMail: newUser.email,role:existingUser.role }, process.env.JWTSecretKey)
            res.status(200).json({existingUser:newUser,token})
    

        }
    } catch (error) {
        res.status(500).json(error)
    }
}




//profile updatation controller
exports.updateUserProfileController = async (req, res) => {
    console.log("inside user profile controller");
    const { username, password, bio, role, profile } = req.body
    const email = req.payload
    console.log(username, password, bio, role, profile);

    const uploadProfile = req.file ? req.file.filename : profile
    //using file for single picture files for more than one picture
    console.log(uploadProfile);


    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, email, password, profile:uploadProfile, bio, role }, { new: true })
        //new: true for updated data 
        res.status(200).json(updateUser)
    } catch (error) {
        res.ststus(500).json(error)
    }
}

//get all users in admin
exports.getAllUsersAdminController = async (req, res) => {
            const userMail = req.payload
    try {
        const allUsers = await users.find({email : {$ne : userMail}})
         res.status(200).json(allUsers)

    } catch (error) {
        res.ststus(500).json(error)
    }
}


//update admin profile

exports.updateAdminProfileController = async (req, res) => {
    console.log("inside admin update profile controller");
    const { username, password, profile,bio } = req.body
    const email = req.payload
    const role=req.role
    console.log(username, password,role,bio);

    const uploadProfile = req.file ? req.file.filename : profile
    //using file for single picture files for more than one picture
    console.log(uploadProfile);


    try {
        const updateAdmin = await users.findOneAndUpdate({ email }, { username, email, password, profile: uploadProfile, bio, role }, { new: true })
        //new: true for updated data 
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
}







