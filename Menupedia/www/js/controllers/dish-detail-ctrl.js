'use strict';

angular.module('menupedia')
	.controller('DishDetailCtrl', function ($scope, $state, $stateParams, Menus, Auth, toastr) {

		$scope.dishId = $stateParams.dishId;

		$scope.dish = Menus.dish_by_id($scope.dishId);

		$scope.get_image_url = Menus.image_url_by_name;

		$scope.ready = function() {
			return $scope.profile && $scope.dish;
		}
		$scope.amOwner = function() {
			return $scope.ready() && $scope.profile.restaurantId === $scope.dish.restaurantId;
		};

		$scope.remove = function() {
			Menus.delete_dish($scope.dish.restaurantId, $scope.dish.$id);
			$state.transitionTo('app.patron_menu', 
													{ restaurantId: $scope.profile.restaurantId });
			toastr.warning('Dish deleted.');
		};

		$scope.profile = Auth.profile;
		$scope.$watch(function() { return Auth.profile; }, 
									function() { $scope.profile = Auth.profile; });
	
	
		
		function dishExists (obj, dishid){
			for (var i in obj){
				if (obj[i].dishId === dishid){
					return true;
				}
			}
			return false;
		}

		$scope.vote = function (dishId, type) {
			if (dishExists(Auth.profile.favorites,dishId)){
				toastr.info("You have already rated it")
				return 
			}
				
			
			if (Auth.profile)
				Menus.dishVote(dishId, type, Auth.profile.uid)
			else
				Auth.loginModalOpen();
		}
	});
