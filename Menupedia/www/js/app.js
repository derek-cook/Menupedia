'use strict';
/* global window, cordova, StatusBar */
/* eslint angular/window-service: 0 */
/* eslint angular/controller-as-route: 0 */

angular.module('menupedia', [
	'ionic',
	'firebase',
	'ngCordova',
	'ngAnimate',
	'toastr'

])
	.constant('FURL', 'https://menupedia-dbcec.firebaseio.com/')
	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar
			// above the keyboard for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault(); // org.apache.cordova.statusbar required
			}
		});
	})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.views.swipeBackEnabled(false);
	$ionicConfigProvider.scrolling.jsScrolling(false); //improve the preferance, see http://scottbolinger.com/4-ways-to-make-your-ionic-app-feel-native/ for detail

	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			controller: 'TabCtrl',
			templateUrl: 'templates/tabs.html'
		})

	.state('app.homepage', {
		url: '/homepage',
		views: {
			menuContent: {
				templateUrl: 'templates/homepage.html',
				controller: 'HomepageCtrl'
			}
		}

	})
		.state('app.patron_profile', {
			url: '/patron_profile',
			views: {
				menuContent: {
					templateUrl: 'templates/patron-profile.html',
					controller: 'PatronProfileCtrl'
				}
			}
		})

	.state('app.select_rest', {
		url: '/restaurant_selection',
		views: {
			menuContent: {
				templateUrl: 'templates/restaurant-selection.html',
				controller: 'RestaurantSelectionCtrl'
			}
		}
	})

	.state('app.patron_menu', {
		url: '/patron_menu/:restaurantId',
		views: {
			menuContent: {
				templateUrl: 'templates/patron-menu-homepage.html',
				controller: 'PatronMenuHomepageCtrl'
			}
		}
	})
	.state('app.user_reward', {
		url: '/user_reward',
		views: {
			menuContent: {
				templateUrl: 'templates/user-reward.html',
				controller: 'UserRewardCtrl'
			}
		}
	})

	.state('app.dish_detail', {
		url: '/dish_detail/:dishId',
		views: {
			menuContent: {
				templateUrl: 'templates/dish-detail.html',
				controller: 'DishDetailCtrl'
			}
		}
	})

	.state('app.resturant_create', {
		url: '/createResturant',
		views: {
			menuContent: {
				templateUrl: 'templates/create-restaurant.html',
				controller: 'CreateRestCtrl'
			}
		}
	})
	.state('app.reviewPhoto', {
		url: '/reviewPhoto',
		views: {
			menuContent: {
				templateUrl: 'templates/review-photo.html',
				controller: 'ReviewPhotoCtrl'
			}
		}
	}).state('app.owner_main', {
		url: '/ownerMain',
		views: {
			menuContent: {
				templateUrl: 'templates/owner-main.html',
				controller: 'OwnerMainCtrl'
			}
		}
	});
	

	// if none of the above states are matched, use this as the fallback.
	$urlRouterProvider.otherwise('/app/homepage');
});
