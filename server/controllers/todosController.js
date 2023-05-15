const mongoose = require("mongoose");

const db_todos = require("../models/todoModel");
const db_users = require("../models/usersModel");
// const currUser = require("./userController");

const addData = async (req, res) => {
    let { id } = req.params;
    const { title, reminder } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Not found" });
    }
    try {
        let todo = await db_todos.create({ title, reminder })
        let resp = await db_users.findById(id);
        resp.todos.push(todo);
        resp.save();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
    }
}

const getTodos = async (req, res) => {
    try {
        const { id } = req.params;
        db_users.findById(id).populate("todos").then((doc) => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(400);
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const editTodo = async (req, res) => {
    try {
        let { id } = req.params;
        const { title, reminder } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not found" });
        }
        let todo = await db_todos.findByIdAndUpdate(id, { title, reminder });
        todo.save();
        res.status(200).json(todo);
    } catch (error) {
        console.log(error.message);
    }
}


const delTodo = async (req, res) => {
    try {
        const { id1, id2 } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id1)) {
            return res.status(400).json({ error: "Not found" });
        }
        await db_todos.findByIdAndDelete(id2);
        const userDoc = await db_users.findById(id1);
        if (userDoc) {
            const index = userDoc.todos.indexOf(id2);
            userDoc.todos.splice(index, 1);
            await userDoc.save();
            res.json(userDoc);
        }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    addData,
    delTodo,
    editTodo,
    getTodos
}