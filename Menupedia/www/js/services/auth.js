'use strict';

angular.module('menupedia')
	.factory('Auth', function (
		FURL,
		Firebase,
		$firebaseArray,
		$firebaseObject,
		$ionicModal,
		toastr,
		$log) {
		var ref = new Firebase(FURL);
		var loginPage = null;

		var initModal = function () {
			$ionicModal.fromTemplateUrl('templates/partials/login.html', {
				animation: 'slide-in-up'
			}).then(function (modal) {
				loginPage = modal;
			});
		}
		var fetchProfile = function (uid) {
			// fetch profile from database
			$firebaseObject(ref.child('profile').child(uid)).$loaded(function (data) {
				auth.profile = data;
				$log.info("fetch user profile: ", auth.profile)
			})
		}
		var createNewProfile = function (uid, email) {
			var newObject = {
				uid: uid,
				email: email,
				patronOrOwner: 0 // 0 == patron , 1= owner
			}
			ref.child('profile').child(uid).set(newObject);
		}
		initModal();
		// init the modal


		var auth = {
			profile: null,
			// purpose for using modal for registation:
			// Can pop up anywhere, although the normal page can pop up any where, OK, I just silly and I dont know what advantage for using a modal. Haaaaa, we can refine in iteration 3, put a card on trello
			loginModalClose: function () {
				loginPage.hide();
			},
			loginModalOpen: function () {
				loginPage.show();	
			},
			signout: function () {
				return firebase.auth().signOut().then(function () {
					toastr.success("sign out successfully");
				}, function (error) {
					toastr.error(error);
				});
			},
			emailSignin: function (email, password) {
				firebase.auth().signInWithEmailAndPassword(
					email,
					password
				).then(function (response) {
					$log.info("SUCCESS! The response is:", response);
					fetchProfile(response.uid);
					auth.loginModalClose();
				}).catch(function (err) {
					$log.info(err);
				});
			},
			registerNewEmail: function (e, p) {
				if (auth.profile) {
					toastr.error("You have to log out then register a new account")
					return;
				}
				// thinking about only return createUserWithEmailAndPassword, since the console.log should be put in the controller, but the createNewprofile should put in service, so kinda confused 
				return firebase.auth().createUserWithEmailAndPassword(e, p).then(function (data) {
					toastr.success("register successfully!");
					var e = data.email;
					var id = data.uid;
					createNewProfile(id, e);
					fetchProfile(id);
					auth.loginModalClose();
				}).catch(function (err) {
					toastr.error(err.message);
				});
			}

		}
		// trigger every time the auth state changes
		firebase.auth().onAuthStateChanged(function (user) {
			$log.info("onauth ", user)
			if (user && user.uid) {
				fetchProfile(user.uid);
				//toastr.info("profile fetched" + user.uid)
			} else {
				auth.profile = null;
				toastr.info("No profile")
			}
		})
		return auth;
	})