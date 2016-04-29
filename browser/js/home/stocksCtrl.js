app.controller('stocksCtrl', function($scope, StocksFactory, $state, $timeout) {
	// $scope.test = "hello";

	$scope.search;
	$scope.searchResults = null;
	$scope.repeated;

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
		//check if unique stock -> needs to validate in the backend too, but validate in the front end to save the http call
		for (let s of $scope.allStocks) {
			if(s.symbol === $scope.searchResults.symbol) {
				$scope.stockAlreadyIn();
				return;
			}
		}
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


	$scope.stockAlreadyIn = function() {
		$scope.repeated = true;
		$timeout(function() {
			$scope.repeated = false;
		}, 1500);
	}

	refreshStocks();

	// console.log($scope.allStocks)
})
