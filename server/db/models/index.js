var stocksObj = require('../index.js').db;
var Stocks = require('./stocks')(stocksObj);

// stocksObj.sync({ force: true });

module.exports = {
  Stocks: Stocks
};