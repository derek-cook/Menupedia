'use strict';

angular.module('menupedia')
	.factory('Reward', function (FURL,
		Firebase,
		$firebaseArray,
		$firebaseObject,
		$cordovaBarcodeScanner,
		$q,
		$ionicPopup,
		toastr) {

		var ref = new Firebase(FURL);

		function useTheReward(rewardId) {
			var time = new Date().getTime();
			var obj = {
				used: true,
				useTime: time
			}
			ref.child("reward").child(rewardId).update(obj);
		}

		function openConfirm(RewardObj) {
			if (RewardObj.used) {
				$ionicPopup.alert({
					title: 'The coupon is used',
					template: '<br>You already used this coupon </br> ' + RewardObj.description + ' on<br>  ' + Reward.convertTime(RewardObj.useTime) + '</br>'
				});
			} else {
				var confirmPopup = $ionicPopup.confirm({
					title: 'This is a valid Reward',
					template: '<br>confirm to use this coupon:</br> ' + RewardObj.description
				});
				confirmPopup.then(function (res) {
					if (res) {
						useTheReward(RewardObj.code)
						toastr.success("Coupon is used!")
					} else {
						toastr.info("It can save later")
					}
				});

			}
		}



		var Reward = {
			convertTime: function (timestamp) {
				return new Date(timestamp).toUTCString();
			},
			getAllRewardByUser: function (uid) {
					return $firebaseArray(ref.child("reward").orderByChild("user").equalTo(uid));
				
			},
			getAllRewardByOwner: function (uid) {
				return $firebaseArray(ref.child("reward").orderByChild("owner").equalTo(uid));
			},
			createNewReward: function (obj) {
				if (!obj.user || !obj.owner || !obj.description)
					return
				var key = ref.child("reward").push().key();
				obj.code = key;
				var time = new Date().getTime();
				obj.generateTime = time;
				/*
			obj={
				user:
				owner:
				code: key
				used: false
				description:
			}
			*/
				return ref.child("reward").child(key).set(obj);
			},
			reveal:function(rewardId){
				ref.child("reward").child(rewardId).child("mystery").set(false);
			},
			scanQRCode: function () {
				var p = $q.defer();
				$cordovaBarcodeScanner.scan().then(function (barcodeData) {
					p.resolve(barcodeData.text);
				}, function (error) {
					p.reject(error);
				}, {
					"preferFrontCamera": true, // iOS and Android
					"showFlipCameraButton": true, // iOS and Android
					"prompt": "Place a QR code inside the scan area", // supported on Android only
					"formats": "QR_CODE"
				})
				return p.promise;
			},

			getTheReWardInfor: function (codeData,restaurantId) {
				if (!codeData)
					return;
				ref.child('reward').child(codeData).once('value', function (snapshot) {
					if (snapshot.val() ) {
						if (snapshot.val().owner == restaurantId){
							openConfirm(snapshot.val());
							}
						else
						toastr.error("This code is for another restaurant")
						
					} else {
						toastr.error("Did not find the code foe this coupon")
					}
				})
			}
		}
		return Reward;
	})