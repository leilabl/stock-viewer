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
	}

	StocksFactory.deleteStock = function(stockSymbol) {
		return $http.delete('api/stocks/'+ stockSymbol)
	}

	return StocksFactory;
})