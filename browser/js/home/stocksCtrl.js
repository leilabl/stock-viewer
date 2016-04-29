app.controller('stocksCtrl', function($scope, StocksFactory, $state) {
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
		if ($scope.sharesNumber) $scope.searchResults.shares = $scope.sharesNumber;
		else $scope.searchResults.shares = null;
		// console.log($scope.sharesNumber)
		StocksFactory.addToPortfolio($scope.searchResults)
		.then(function(){
			// console.log('here')
			$scope.searchResults = null;
			$state.reload();
		});
	}

	refreshStocks();

	// console.log($scope.allStocks)
})
