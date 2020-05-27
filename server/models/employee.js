"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      companyId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Employee.associate = function (models) {
    Employee.hasOne(models.Salary, {
      foreignKey: "employeeId",
    });
  };
  return Employee;
};
