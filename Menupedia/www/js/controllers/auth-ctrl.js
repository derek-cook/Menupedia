'use strict';

angular.module('menupedia')
.controller('AuthCtrl', function($scope, Auth,$ionicSlideBoxDelegate,toastr) {
	$scope.data={};
		$scope.data.email="123@qq.com";
		$scope.data.password="123456";
	$scope.signIn=function(){
		Auth.emailSignin($scope.data.email, $scope.data.password);
	}
	$scope.signOut=function(){
		Auth.signout();
	}
		
	$scope.register=function(){
		if (!$scope.data.newEmail){
			toastr.info("Enter your email");
			return;
		}	
		if (!$scope.data.newPassword){
			toastr.info("Enter your password");
			return;
		}	
		if (!$scope.data.newRepeatPassword ){
			toastr.info("Repeat your password");
			return;
		}
		if  ($scope.data.newPassword != $scope.data.newRepeatPassword){
			toastr.info("repeat password not matching")
			return;
		}
		Auth.registerNewEmail($scope.data.newEmail,$scope.data.newPassword)
	}
	
	
});