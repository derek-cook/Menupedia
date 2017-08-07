'use strict';

angular.module('menupedia')
	.factory('RestaurantMain', function (
		FURL,
		Firebase,
		$firebaseArray,
		$firebaseObject,
		toastr,
		$log,
		$q) {

		var ref = new Firebase(FURL);

		return {
			createRestaurant: function (uid, restaurantInfo) {
				var deferred = new $q.defer();

				if (!uid) {
					toastr.error("You have not login, how could you reach here")
					return;
				}
				if (!restaurantInfo.name ||
					!restaurantInfo.address ||
					!restaurantInfo.tel ||
					!restaurantInfo.ownerName ||
					!restaurantInfo.ownerSSN ||
					!restaurantInfo.openHours) {
					toastr.error("Not enough information provided")
					return;
				}
				restaurantInfo.id = "rest_" + uid;

				ref.child('profile').child(uid).child('restaurantId').set(restaurantInfo.id);
				ref.child('restaurants').child(restaurantInfo.id).update(restaurantInfo, function () {
					deferred.resolve(restaurantInfo.id);
				});
				return deferred.promise;
			},

			//This function using a query so you can fliter the value from the array in service (I supposed) and fetch array back to the local
			// In this case it only fliter out the image which "reviewed" is false  
			getAllpendingDish: function (rest_id, reviewed) {
				if (!reviewed) {
					return $firebaseArray(ref.child('pendingImages').child(rest_id).orderByChild("reviewed").equalTo(false));
				} else if (reviewed == "all") {
					return $firebaseArray(ref.child('pendingImages').child(rest_id));
				}
			},

			dishSetReviewed: function (pendingDishId, restId) {
				ref.child('pendingImages').child(restId).child(pendingDishId).child("reviewed").set(true);
				toastr.success("pendingDishId set to reviewed")
			},

			add_Img_to_Dish: function (dishObj) {
				return ref.child('dishes').push(dishObj).key();
			},

			setMasterImg: function (dishId, newImgId, OldImgId) {
				var ptr = this;
				var deferred = new $q.defer();

				ref.child('dishes').child(dishId).child('img').set(newImgId, function (error) {
					if (error)
						deferred.reject(error);
					else {
						toastr.success("set the img" + newImgId + " to new master image, going to set " + OldImgId + "as subimage")
						ptr.updateSubImages(dishId, OldImgId).then(function () {

							deferred.resolve();
						});
					}
				});

				return deferred.promise;
			},

			updateSubImages: function (dishId, newImgId) {
				var deferred = new $q.defer();
				ref.child('dishes').child(dishId).child('subImg').push(newImgId, function (error) {
					if (error)
						deferred.reject(error);
					else {
						toastr.success("seeting the " + newImgId + " to a subImage in dishId = " + dishId);
						deferred.resolve();
					}
				});
				return deferred.promise;
			},

			addNewDishToRestaurant: function (obj, restId) {
				var deferred = new $q.defer();
				var k = this.add_Img_to_Dish(obj);
				ref.child('restaurants').child(restId).child('dishes').push(k, function (error) {
					if (error)
						deferred.reject(error)
					else
						deferred.resolve(k);

				});

				return deferred.promise;
			}

		}
	});
