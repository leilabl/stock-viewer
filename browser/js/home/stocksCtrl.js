app.controller('stocksCtrl', function($scope, StocksFactory, $state, $timeout) {

	$scope.search;
	$scope.searchResults = null;
	$scope.repeated;
	$scope.max;
	$scope.invalid;

	function refreshStocks() {
		StocksFactory.getAllStocks()
		.then(function(stocks) {
			$scope.allStocks = stocks.data;
		});
	}


	$scope.submitSearch = function() {
		StocksFactory.searchStock($scope.search)
		.then(function(stock) {
			if (!stock.Name) $scope.invalidStock();
			else $scope.searchResults = stock;
		})
	}

	$scope.addToPortfolio = function() {
		//check if already 5 stocks -> needs to validate in the backend too, but validate in the front end to save the http call
		if ($scope.allStocks.length>4) {
			$scope.reachedMax();
			return;
		}

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

	$scope.reachedMax = function() {
		$scope.max = true;
		$timeout(function() {
			$scope.max = false;
		}, 1500);
	}

	$scope.invalidStock = function() {
		$scope.invalid = true;
		$timeout(function() {
			$scope.invalid = false;
		}, 1500);
	}

	refreshStocks();
})
