const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth.middleware");
const {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

// semua route project wajib login dulu
router.use(requireAuth);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", addProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
