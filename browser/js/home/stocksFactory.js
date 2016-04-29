app.factory('StocksFactory', function($http) {
	var StocksFactory = {};

	StocksFactory.getAllStocks = function() {
		return $http.get('/api/stocks')
		.then(function(data) {
			return data;
		})	
	}

	StocksFactory.searchStock = function(stockSymbol) {
		return $http.get('api/stocks/'+ stockSymbol)
		.then(function(stock) {
			return stock.data.query.results.quote;
		})

	}

	StocksFactory.addToPortfolio = function(stock) {
		return $http.post('api/stocks/', stock)
		.then(function(st) {
			console.log('here', st)

			// console.log(stock.data.query.results.quote)
			// return stock.data.query.results.quote;
		})

	}


	return StocksFactory;
})