const bcrypt = require("bcrypt");
const db = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const expiry = 60 * 60 * 2;
const genToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: expiry });
}

const registerUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password } = req.body;
        console.log("ss");
        let salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
        const user = await db.create({ firstName, lastName, email, password });
        let token = genToken(user._id);
        console.log(token);
        res.cookie('token', token, { httpOnly: false, maxAge: expiry * 1000 });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400);
        }
    } catch (error) {
        console.log(error);
    }
}

const currUser = async (req, res) => {
    let token = req.cookies.token;
    try {
        if (token) {
            jwt.verify(token, process.env.SECRET_TOKEN, async (err, docs) => {
                if (err) {
                    console.log(err.message);
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
            res.send({ status: "invalid credentials" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { loginUser, registerUser, currUser };
