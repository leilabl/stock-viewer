'use strict';
var router = require('express').Router();
var _ = require('lodash');
const Promise = require('bluebird');
const request = require('request-promise');
const Stocks = require('../../../db/models/index').Stocks;
module.exports = router;

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
        if(!stocks.length) return;
        savedStocks = stocks;
        stocks.forEach(function(el, idx, arr) {
            if (idx === arr.length - 1) stockSymbols += el.dataValues.symbol;        
            else stockSymbols += el.dataValues.symbol +',';
        });
        request(getStockUpdateReq(stockSymbols))
        .then(function(response) {
            let test = JSON.parse(response);
            let parsed = test.query.results.quote;
            let isArr = parsed instanceof Array;

            if (!isArr) {
                console.log('condition', parsed)
                parsed = [parsed];
            } 
            console.log('in the back',parsed)
            for (let i = 0; i <parsed.length; i++) {
                parsed[i]['shares'] = savedStocks[i]['shares'];
            } 
            res.send(parsed)
        })
    })
})

//search from API
router.get('/:stockSymbol', function(req, res, next) {
    let stockSymbols = req.params.stockSymbol;
    request(getStockUpdateReq(stockSymbols), function (error, response, body) {
            if (!error && response.statusCode == 200) {
        res.json(JSON.parse(body));
      }
    });
});

router.post('/', function(req, res, next) {
    Stocks.create({symbol:req.body.symbol.toUpperCase(), shares:req.body.shares})
    .then(function(data) {
        res.sendStatus(201);
    })
})

router.delete('/:stockSymbol', function(req, res, next) {
    Stocks.destroy({ where: { symbol: req.params.stockSymbol }})
    .then(function(data) {
        res.sendStatus(200);
    })
})