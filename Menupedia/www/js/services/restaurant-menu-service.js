'use strict';
/* global CryptoJS */

angular.module('menupedia')
	.factory('Menus', function (FURL, Firebase, $firebaseArray, $firebaseObject) {

		var ref = new Firebase(FURL);

		return {

			all_restaurants: function () {
				return $firebaseArray(ref.child('restaurants'));
			},

			all_dish_for_id: function (id) {
				return $firebaseArray(ref.child('restaurants').child(id).child('dishes'));
			},

			allDishInRestaurant: function (restId) {
				return $firebaseArray(ref.child('dishes').orderByChild("restaurantId").equalTo(restId));
			},

			all_dishes: function () {
				return $firebaseArray(ref.child('dishes'));
			},

			get_restaurant_by_id: function (id) {
				if (id)
					return $firebaseObject(ref.child('restaurants').child(id));
			},

			dish_by_id: function (id) {
				return $firebaseObject(ref.child('dishes').child(id));
			},

			delete_dish: function (rest_id, dish_id) {

				//We also could get key from the $uid, and then we can remove the element base on the ref.child().remove() ???
				ref.child('restaurants/' + rest_id + '/dishes/')
					.on('value', function (dish_list) {
						var dishObject = dish_list.val();
						Object.keys(dishObject || {})
							.filter(function (key) {
								return dishObject[key] === dish_id;
							})
							.forEach(function (key) {
								ref.child('restaurants/' + rest_id + '/dishes/' + key).remove();
							});
					});
				ref.child('dishes').child(dish_id).remove();
				//This function will delete the dish detail in dishes table(we did not delete it before, just remove the dish id in restaurant, why I dont put it in the forEach is because if we did not find the dishId, when we do not keep remove , current firebase has a lot dishes are not link to restaurant)
			},

			makeid: function (urldata) {
				return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(urldata));
			},

			uploadPhoto: function (urldata) {
				var imageName = this.makeid(urldata) + '.jpg';
				var newImage = firebase.storage().ref().child('images/' + imageName);
				var metadata = {
					contentType: 'image/jpeg',
				};
				return newImage.putString(urldata, 'base64', metadata).then(function () {
					return imageName;
				});
			},

			image_url_by_name: function (name) {
				return 'https://firebasestorage.googleapis.com/v0/b/menupedia-dbcec.appspot.com/o/images%2F' + name + '?alt=media';
			},

			add_tempDishToRestaurant: function (dishObj, restId) {
				dishObj.reviewed = false;

				var tpDishId = ref.child('pendingImages').child(restId).push(dishObj).key();

				var newRef = ref.child('restaurants').child(restId).child("newImg");

				newRef.transaction(function (current) {
					if (current) {
						if (!current)
							current = 0;
					}
					return current + 1;
				})

				return tpDishId;
			},

			usersaveUploadingRecord: function (userId, pendingId) {
				if (!userId)
					return;
				ref.child('profile').child(userId).child('uploading').push(pendingId);

			},

			add_dishId_to_restaurant: function (restaurantId, dishId) {
				ref.child('restaurants').child(restaurantId).child('dishes').push(dishId)
			},
			dishVote: function (dishId, type, uid) {
				if (type != "good" && type != "bad"){
					return;
				}
				
				ref.child("profile").child(uid).child('favorites').push({ dishId: dishId, type: type });
				
				
				var newRef = ref.child('dishes').child(dishId).child(type);
				
				newRef.transaction(function (current) {
					if (!current) {
						current = 0
					}
					return current + 1;
				})
			}
			


		};
	});
