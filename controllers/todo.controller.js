const { Todo, Project } = require("../models");
const sendResponse = require("../utils/response");

// GET /todos -> ambil semua todo milik user yg login
// bisa difilter per project: GET /todos?project_id=1
async function getTodos(req, res) {
  try {
    const { project_id } = req.query;
    const where = { user_id: req.session.userId };
    if (project_id !== undefined) where.project_id = project_id;

    const todos = await Todo.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return sendResponse(res, { message: "Berhasil ambil todo", data: todos });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// POST /todos -> tambah todo baru
async function addTodo(req, res) {
  try {
    const { title, project_id } = req.body;

    if (!title) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: "title wajib diisi",
      });
    }

    if (project_id !== undefined && project_id !== null) {
      const project = await Project.findOne({
        where: { id: project_id, user_id: req.session.userId },
      });
      if (!project) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: "Project tidak ditemukan",
        });
      }
    }

    const todo = await Todo.create({
      title,
      user_id: req.session.userId,
      project_id: project_id || null,
    });

    return sendResponse(res, {
      code: 201,
      message: "Todo berhasil ditambahkan",
      data: todo,
    });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// PUT /todos/:id -> update todo (title / is_done)
async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, is_done, project_id } = req.body;

    const todo = await Todo.findOne({
      where: { id, user_id: req.session.userId },
    });
    if (!todo) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    if (project_id !== undefined && project_id !== null) {
      const project = await Project.findOne({
        where: { id: project_id, user_id: req.session.userId },
      });
      if (!project) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: "Project tidak ditemukan",
        });
      }
    }

    if (title !== undefined) todo.title = title;
    if (is_done !== undefined) todo.is_done = is_done;
    if (project_id !== undefined) todo.project_id = project_id;
    await todo.save();

    return sendResponse(res, { message: "Todo berhasil diupdate", data: todo });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// DELETE /todos/:id
async function deleteTodo(req, res) {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      where: { id, user_id: req.session.userId },
    });
    if (!todo) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    await todo.destroy();

    return sendResponse(res, { message: "Todo berhasil dihapus" });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
