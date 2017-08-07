'use strict';

angular.module('menupedia')
.controller('RestaurantSelectionCtrl', function($scope, Menus) {
	$scope.restaurants = Menus.all_restaurants();
});
