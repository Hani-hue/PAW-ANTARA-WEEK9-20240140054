const { Project, Todo } = require("../models");
const sendResponse = require("../utils/response");

// GET /projects -> ambil semua project milik user yg login
async function getProjects(req, res) {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.session.userId },
      order: [["createdAt", "DESC"]],
    });

    return sendResponse(res, {
      message: "Berhasil ambil project",
      data: projects,
    });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// GET /projects/:id -> detail project + todo yg ikut project itu
async function getProjectById(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, user_id: req.session.userId },
      include: [{ model: Todo }],
    });

    if (!project) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Project tidak ditemukan",
      });
    }

    return sendResponse(res, {
      message: "Berhasil ambil detail project",
      data: project,
    });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// POST /projects -> tambah project baru
async function addProject(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: "name wajib diisi",
      });
    }

    const project = await Project.create({
      name,
      description: description || null,
      user_id: req.session.userId,
    });

    return sendResponse(res, {
      code: 201,
      message: "Project berhasil ditambahkan",
      data: project,
    });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// PUT /projects/:id -> update project (name / description)
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findOne({
      where: { id, user_id: req.session.userId },
    });
    if (!project) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Project tidak ditemukan",
      });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    await project.save();

    return sendResponse(res, {
      message: "Project berhasil diupdate",
      data: project,
    });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

// DELETE /projects/:id -> hapus project (todo di dalamnya ikut kehapus, lihat relasi CASCADE)
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, user_id: req.session.userId },
    });
    if (!project) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: "Project tidak ditemukan",
      });
    }

    await project.destroy();

    return sendResponse(res, { message: "Project berhasil dihapus" });
  } catch (err) {
    return sendResponse(res, {
      code: 500,
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
};
