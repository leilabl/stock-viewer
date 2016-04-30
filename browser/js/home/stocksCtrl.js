app.controller('stocksCtrl', function($scope, StocksFactory, $state, $timeout, $interval) {

	$scope.search;
	$scope.searchResults = null;
	$scope.repeated;
	$scope.max;
	$scope.invalid;
	$scope.allStocks = [];
	$scope.cache = [];

	function refreshStocks() {
		$scope.cache = $scope.allStocks;
		StocksFactory.getAllStocks()
		.then(function(stocks) {
			$scope.allStocks = stocks.data;
			$scope.allStocks.forEach(function(stock, idx) {
				if (stock.LastTradePriceOnly > $scope.cache[idx].LastTradePriceOnly) {
					stock.increase = true;
					stock.decrease = false;
				} else if (stock.LastTradePriceOnly < $scope.cache[idx].LastTradePriceOnly) {
					stock.decrease = true;
					stock.increase = false;
				}
			});
			// console.log($scope.allStocks);
			// console.log($scope.cache);
		});
	}

	refreshStocks();

	$interval(refreshStocks, 5000);

	$scope.submitSearch = function() {
		StocksFactory.searchStock($scope.search)
		.then(function(stock) {
			if (!stock.Name) $scope.invalidStock();
			else $scope.searchResults = stock;
		})
	}

	$scope.addToPortfolio = function() {
		if ($scope.allStocks) {
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
		}
		if ($scope.sharesNumber) $scope.searchResults.shares = $scope.sharesNumber;
		else $scope.searchResults.shares = null;

		$scope.tempSearch = $scope.searchResults;
		$scope.searchResults = null;

		StocksFactory.addToPortfolio($scope.tempSearch)
		.then(function(){
			$state.reload();
		});
	}

	$scope.deleteStock = function(stockSymbol) {
		StocksFactory.deleteStock(stockSymbol)
		.then(function() {
			$state.reload();
		})
	}


	// Alerts
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

})
