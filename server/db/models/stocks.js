'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Stocks = db.define('stocks', {
    symbol: Sequelize.STRING,
    shares: Sequelize.INTEGER
	},{
    timestamps: false
  });

  return Stocks;
};