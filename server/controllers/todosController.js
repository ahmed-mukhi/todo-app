const mongoose = require("mongoose");

const db_todos = require("../models/todoModel");
const db_users = require("../models/usersModel");

const addData = async (req, res) => {
    let { uid } = req.params;
    const { title, reminder } = req.body;
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: "Not found" });
    }
    try {
        let todo = await db_todos.create({ title, reminder })
        let resp = await db_users.findById(uid);
        resp.todos.push(todo);
        resp.save();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
    }
}

const getTodos = async (req, res) => {
    try {
        let resp;
        const { uid } = req.params;
        db_users.findById(uid).populate("todos").then((doc) => {
            if (doc) {
                resp = doc;
            }
        });
        res.status(200).json(resp);

    } catch (error) {
        console.log(error);
    }
}

const editTodo = async (req, res) => {
    try {
        let { id } = req.params;
        const { title, reminder } = req.body;
        let todo = await db_todos.findByIdAndUpdate(id, { title, reminder });
        todo.save();
        res.status(200).json(data);
    } catch (error) {
        console.log(error.message);
    }
}


const delTodo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not found" });
        }
        const resp = await db_todos.findByIdAndDelete(id);
        res.status(200).json(resp);
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