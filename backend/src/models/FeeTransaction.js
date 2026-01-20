const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeTransaction = sequelize.define(
  'FeeTransaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid'),
      defaultValue: 'pending',
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    paidDate: {
      type: DataTypes.DATE,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'fee_transactions',
    timestamps: true,
  }
);

module.exports = FeeTransaction;
