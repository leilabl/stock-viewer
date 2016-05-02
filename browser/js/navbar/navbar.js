app.directive('navbar', function() {
	return {
		restrict: 'E',
		// scope: {},
		templateUrl: 'js/navbar/navbar.html',
		// link: function(scope) {
		// 	scope.isCollapsed = true;
		// },
		replace: true
	}
})