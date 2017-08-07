'use strict';

/* global Camera, CameraPopoverOptions */

// Note: Camera only works on a mobile device. Upload to ionic view, and test
// taking photos from your cellphone.
angular.module('menupedia')
	.factory('Camera', function ($cordovaCamera, $document, $log, $q) {

		// Use a function here so that the Camera.* variables are not de-referenced
		// until they are loaded (which seems to happen by the time we take a
		// picture... shrug).
		function defaultOptions() {
			return {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 200,
				targetHeight: 200,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};
		}

		function cameraOptions() {
			return defaultOptions();
		}

		function libraryOptions() {
			var options = defaultOptions();
			options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
			return options;
		}

		function logAndReThrow(err) {
			$log.error(err);
			throw err;
		}

		return {

			takePhotoFromCamera: function () {
				return $cordovaCamera.getPicture(cameraOptions()).catch(logAndReThrow);
			},

			takePhotoFromLibrary: function () {
				return $cordovaCamera.getPicture(libraryOptions()).catch(logAndReThrow);
			},

			takePhotoFromDev: function() {
				var input = $document[0].createElement('input');
				var deferred = $q.defer();
				input.type = 'file';
				input.onchange = function () {
					if(this.files && this.files[0]) {
						var reader = new FileReader();
						reader.onload = function (e) {
							deferred.resolve(e.target.result.substring(23));
						};
						reader.readAsDataURL(input.files[0]);
					}
				}
				input.click();
				return deferred.promise;
			}

		};

	});
