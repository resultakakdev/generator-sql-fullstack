'use strict';

module.exports = function(sequelize, DataTypes) {
  var <%= classedName %> = sequelize.define('<%= classedName %>', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  });

  return <%= classedName %>;
};
