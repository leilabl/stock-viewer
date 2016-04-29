var stocksObj = require('../index.js').db;
var Stocks = require('./stocks')(stocksObj);

module.exports = {
  Stocks: Stocks
};