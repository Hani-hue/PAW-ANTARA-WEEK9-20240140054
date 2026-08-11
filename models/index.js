const sequelize = require("../config/database");
const User = require("./user.model");
const Project = require("./project.model");
const Todo = require("./todo.model");

module.exports = {
  sequelize,
  User,
  Project,
  Todo,
};
