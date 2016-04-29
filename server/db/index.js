'use strict';

var Sequelize = require('sequelize');
var stocksdb = new Sequelize('stocksdb', 'postgres', 'newPassword', {
    dialect: 'postgres',
    port: 5432,
    logging: false
  });

module.exports = {
  promiseForStocksDB: stocksdb
                    .authenticate()
                    .then(function(){
                      console.log("we're connected . . . now!")
                    })
                    .catch(function(err){
                      console.log('problem connecting:', err)
                    }),
  db: stocksdb
}