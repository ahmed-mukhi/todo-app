require("dotenv").config();
const express = require("express");
let path = require("path");
const myRoutes = require("./routes/rootRouter");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//https://drab-gray-rooster-hem.cyclic.app
app.use(cors({ credentials: true, origin: "https://todo-app-68mu.vercel.app/" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(myRoutes);


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        (err) => {
            res.status(500).send("error is this one", err);
        }
    )
});


mongoose.connect(process.env.MONG_URI).then(() => {
    try {
        console.log("mongoose connnected");
        app.listen(process.env.PORT, () => {
            console.log("Listeneing on", process.env.PORT);
        });
    } catch (error) {
        console.log(error)
    }
}).catch((err) => {
    console.log(err);
})
