const bcrypt = require("bcrypt");
const db = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const qrcode = require("qrcode");
const { authenticator } = require("otplib");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const expiry = 60 * 60 * 2;
const genToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: expiry });
}



const genQrCode = async (req, res) => {
    try {
        let token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, docs) => {
            if (!err) {
                let secret = authenticator.generateSecret();
                const uri = authenticator.keyuri(docs.id, "NCYS PROJECT BCY-3A", secret);
                const image = await qrcode.toDataURL(uri);
                await db.findByIdAndUpdate(docs.id, { secret });
                res.status(200).send({ success: "Generated QR Code Successfully", image });
            } else {
                throw "Not Completed First Step Auth YEt";
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error });
    }
}


const verifyQrImage = async (req, res) => {
    try {
        const { code } = req.query;
        let token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, docs) => {
            if (!err) {
                const user = await db.findById(docs.id);
                const storedCode = user.secret;
                console.log(storedCode);
                let result = authenticator.check(code, storedCode);
                console.log(result);
                res.send({ success: result });
            }
        });
    } catch (error) {
        console.error(error);
    }
}


const registerUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password, phone, profileImage } = req.body;
        let salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
        const checkEmail = await db.find({ email: email });
        if (checkEmail.length) {
            res.json({ error: "Email already exists" });
        } else {
            let fileResult = await cloudinary.uploader.upload(profileImage, {
                folder: "userImages"
            });
            const { secure_url, public_id } = fileResult;
            const user = await db.create({ phone, firstName, lastName, email, password, profileImage: { secure_url: secure_url, public_id: public_id } });
            let token = genToken(user._id);
            res.cookie('token', token, { httpOnly: false, maxAge: expiry * 1000 });
            if (user) {
                res.status(200).json(user);
            } else {
                throw "user_exception";
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const currUser = async (req, res) => {
    let token = req.cookies.token;
    try {
        if (token) {
            jwt.verify(token, process.env.SECRET_TOKEN, async (err, docs) => {
                if (err) {
                    res.send({ error: "Invalid ID" });
                } else {
                    let user = await db.findById(docs.id);
                    res.status(200).json(user);
                }
            });
        } else {
            res.send({ error: "Invalid ID" });
        }
    } catch (error) {
        console.log(error);
    }
}

const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ logOut: "success" });
    } catch (error) {
        console.log(error);
    }
}

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await db.findOne({ email: email });
        if (user) {
            const validPass = await bcrypt.compare(password, user.password);
            if (validPass) {
                let token = genToken(user._id);
                res.cookie("token", token, { httpOnly: false, maxAge: expiry * 1000 });
                res.status(200).json(user)
            } else {
                res.send({ status: "invalid credentials" });
            }
        } else {
            res.send({ status: "Email does not exists" });
        }
    } catch (error) {
        console.log(error);
    }
}


const editUserDetails = async (req, res) => {
    try {
        const updateFields = req.body;
        const { id } = req.params;
        let user = await db.findById(id);
        if (user) {
            if (updateFields.profileImage !== null) {
                try {
                    let newFile = await cloudinary.uploader.upload(updateFields.profileImage, {
                        overwrite: true,
                        public_id: user.profileImage.public_id
                    })
                    const { secure_url, public_id } = newFile;
                    updateFields.profileImage = { secure_url, public_id }
                } catch (error) {
                    console.error(error);
                }
            } else {
                updateFields.profileImage = user.profileImage;
            }
            Object.entries(updateFields).forEach(([key, value]) => {
                user[key] = value;
            });
            await user.save();
            return res.status(200).json({ message: 'Edit performed successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error editing user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const verifyCaptcha = async (req, res) => {
    try {
        const { val } = req.body;
        const resp = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${val}`);
        const { data } = resp;
        return res.json(data);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}


module.exports = { loginUser, registerUser, currUser, logOut, editUserDetails, verifyCaptcha, genQrCode, verifyQrImage };
