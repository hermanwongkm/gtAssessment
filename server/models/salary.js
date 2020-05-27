"use strict";
module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define(
    "Salary",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      salary: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {}
  );
  Salary.associate = function (models) {};
  return Salary;
};
