'use strict';
var router = require('express').Router();
var _ = require('lodash');
const Promise = require('bluebird');
const request = require('request-promise');
const Stocks = require('../../../db/models/index').Stocks;
module.exports = router;
// const YQL = require('yql');
// var query = new YQL('SELECT * FROM yahoo.finance.quote WHERE symbol = "G"')

var testData = [{
            symbol: "FB",
            LastTradePriceOnly: "117.91",
            Name: "Facebook, Inc."
        },
        {
            symbol: "GOOG",
            LastTradePriceOnly: "697.80",
            Name: "Alphabet Inc."
        },
        {
            symbol: "YHOO",
            LastTradePriceOnly: "37.0599",
            Name: "Yahoo! Inc."
        }
    ]


function getStockUpdateReq(stockSymbols) {
    return 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20%28%22' + stockSymbols + '%22%29&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
}

//show all stocks in portfolio with updated prices
router.get('/', function(req, res, next) {
    let stockSymbols = '';
    let savedStocks;
    Stocks.findAll()
    .then(function(stocks) {
        savedStocks = stocks;
        stocks.forEach(function(el, idx, arr) {
            if (idx === arr.length - 1) stockSymbols += el.dataValues.symbol;        
            else stockSymbols += el.dataValues.symbol +',';
        });
        request(getStockUpdateReq(stockSymbols))
        .then(function(response) {
            let test = JSON.parse(response);
            let parsed = test.query.results.quote;
            for (let i = 0; i <parsed.length; i++) {
                parsed[i]['shares'] = savedStocks[i]['shares'];
            } 
            // console.log('####testtt',parsed)
            res.send(parsed)
        })
    })
})

//search from API
router.get('/:stockSymbol', function(req, res, next) {
    request('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20%28%22' + req.params.stockSymbol+ '%22%29&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', function (error, response, body) {
            if (!error && response.statusCode == 200) {
        // console.log('!!!!body', body) // Show the HTML for the Google homepage. 
        res.json(JSON.parse(body));
      }
    });
});

router.post('/', function(req, res, next) {
    Stocks.create({symbol:req.body.symbol, shares:1})
    .then(function(data) {
        // console.log('posted', data)
        res.status(201).send(data);
    })
    // console.log('###inside post',req.body)
})
