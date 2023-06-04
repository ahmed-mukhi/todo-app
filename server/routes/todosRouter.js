const express = require("express");
const router = express.Router();
const { addData, delTodo, editTodo, getTodos } = require("../controllers/todosController");

router.post("/add/:id", addData);
router.delete("/del/:id", delTodo);
router.patch("/edit/:id", editTodo);
router.get("/get/:id", getTodos);



module.exports = router;