const mongoose = require("mongoose");

const db_todos = require("../models/todoModel");
const db_users = require("../models/usersModel");
// const currUser = require("./userController");

const addData = async (req, res) => {
    let { id } = req.params;
    // const { title, reminder } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Not found" });
    }
    try {
        let todo = await db_todos.create({ ...req.body })
        let resp = await db_users.findById(id);
        resp.todos.push(todo);
        resp.save();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        console.log("This is running in error");
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
        // const { title, reminder } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Not found" });
        }
        let todoResp = await db_todos.findByIdAndUpdate(id, { ...req.body });
        console.log(todoResp);
        // todo.save();
        res.status(200).json(todoResp);
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
        await db_todos.findByIdAndDelete(id);
        const userDoc = await db_users.updateMany({ todos: { $in: [id] } }, { $pull: { todos: id } });
        if (userDoc) {
            res.json(userDoc);
        }
        //     const index = userDoc.todos.indexOf(id2);
        //     userDoc.todos.splice(index, 1);
        //     await userDoc.save();
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