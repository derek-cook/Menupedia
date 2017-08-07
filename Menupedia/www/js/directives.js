'use strict';
/* global QRCode */

angular.module('menupedia')
	.directive("thumbs", function ($timeout) {
		return {
			restrict: "A",
			link: function ($scope, ele, attrs) {
				ele.bind('click', function () {

					var animateType = attrs.thumbs == "up" ? "zoomIn" : "zoomOut";
					ele.addClass("animated " + animateType);
					$timeout(function () {
						ele.removeClass('animated ' + animateType)
					}, 1000)
				});
			}
		};
	})
	.directive("bteffect", function ($timeout) {
		return {
			restrict: "A",
			link: function ($scope, ele, attrs) {
				ele.bind('click', function () {
					var animateType = attrs.bteffect;
					ele.addClass("animated " + animateType);
					$timeout(function () {
						ele.removeClass('animated ' + animateType)
					}, 1000)
				});
			}
		};
	})
	.directive("openMenu", function ($ionicSideMenuDelegate) {
		return {
			restrict: "A",
			link: function ($scope, ele) {
				ele.bind('click', function () {
					$ionicSideMenuDelegate.toggleLeft();
				});
			}
		};
	})

.directive("qrCode", function () {
	return {
		restrict: "E",
		template: "",
		link: function ($scope, ele, attrs) {
			
			var h = ele[0].clientHeight;
			var w = ele[0].clientWidth;
			h < 128 ? h : 128;
			w < 128 ? w : 128;
			var option = {
				text: attrs.code,
				width: h,
				height: h,
				colorDark: "#22221f",
				colorLight: "rgba(242, 208, 94, 0.99)",
				correctLevel: QRCode.CorrectLevel.H
			}
			new QRCode(ele[0], option);
		}

	};
})