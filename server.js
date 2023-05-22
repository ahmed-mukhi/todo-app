require("dotenv").config();
const express = require("express");
const path = require("path");
const myRoutes = require("./routes/rootRouter");
// const userRoutes = require("./routes/userRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");



app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(myRoutes);


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        (err) => {
            res.status(500).send(err);
        }
    )
});

mongoose.connect(process.env.MONG_URI).then(() => {
    try {
        app.listen(process.env.PORT, () => {
            console.log("Listeneing on", process.env.PORT);
            console.log("mongoose connnected");
        });
    } catch (error) {
        console.log(error)
    }
}).catch((err) => {
    console.log(err);
})