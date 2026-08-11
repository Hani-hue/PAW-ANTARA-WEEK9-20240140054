const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  },
);

// relasi: satu user punya banyak project
User.hasMany(Project, { foreignKey: "user_id", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "user_id" });

module.exports = Project;
