'use strict';

var connectToDb = require('../server/db').db;
var Promise = require('bluebird');

var Stocks = require('../server/db/models').Stocks;

var seedStocks = function () {
  
  var stocks = [{
            symbol: "FB",
            shares: 1
        },
        {
            symbol: "GOOG",
            shares: 2
        },
        {
            symbol: "YHOO",
            shares: 3
        }
    ]
  return Stocks.destroy({where: {}})
  .then(function(){
    return Stocks.bulkCreate(stocks);
  }).catch(function(err){
    console.error('error seeding stocks', err)
  }) 
}

seedStocks();
