const express = require("express");
const router = express.Router();
const { addData, delTodo, editTodo, getTodos } = require("../controllers/todosController");

router.post("/:id", addData);
router.delete("/:id", delTodo);
router.patch("/:id", editTodo);
router.get("/:id", getTodos);



module.exports = router;