app.controller('stocksCtrl', function($scope, StocksFactory) {
	// $scope.test = "hello";

	$scope.search;
	$scope.searchResults = null;

	function refreshStocks() {
		StocksFactory.getAllStocks()
		.then(function(stocks) {
			$scope.allStocks = stocks.data;
		});
	}


	$scope.submitSearch = function() {
		$scope.query = $scope.search;
	//console.log($scope.search)
		StocksFactory.searchStock($scope.query)
		.then(function(stock) {
			$scope.searchResults = stock;
		})
	}

	$scope.addToPortfolio = function() {
		StocksFactory.addToPortfolio($scope.searchResults)
		.then(function(){
			console.log()
			$scope.searchResults = null;
			refreshStocks();
		});
	}

	refreshStocks();

	// console.log($scope.allStocks)
})
