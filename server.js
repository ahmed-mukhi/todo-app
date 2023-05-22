require("dotenv").config();
const express = require("express");
let path = require("path");
const myRoutes = require("./routes/rootRouter");
// const userRoutes = require("./routes/userRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        (err) => {
            console.log(err);
            res.status(500).send(err);
        }
    )
});



app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(myRoutes);


<<<<<<< HEAD
=======
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./frontend/build/index.html"),
        (err) => {
            res.status(500).send(err);
        }
    )
});

>>>>>>> eb7fbd319d534cc1a3b221d6c9bcfd9b55e6ae32
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
