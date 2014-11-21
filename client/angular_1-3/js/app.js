/**
 * IFClient App module
 */
angular.module('ifclientApp', ['ngSanitize', 'ifclientLibrary', 'ifuriConstants', 'utilityLibrary', 'deferredLibrary', 'packageLibrary', 'hashLibrary']);

angular.module ('ifclientApp').directive ('ifChat', function (ifclientLib, $window, $sce, packLib, deferredLib, hashLib) {
	
	function processClientListPackage (pkg) {
		var list = pkg.list.sort();
		var contacts = ['ALL'];
		for (var n = 0, nLen = list.length; n < nLen; n++) {
			if (list [n] === ifclientLib.getUsername()) {
				continue;
			}
			contacts.push(list [n]);
		}

		return deferredLib.when(contacts);
	}

	function processTextMessagePackage (pkg) {
		return deferredLib.when (('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, pkg.recipient).replace(/%MESSAGE%/g, pkg.body));
	}
	
	function processFilesPackage (pkg) {
	
		var responseHTML = "";
		var defers = [];
		var deferHASH = hashLib.create();
		var files = pkg.files;
		var fileCount = 0;

		/**
		* Handle file transmission
		* @param fileInfo
		*/
		function handleFile(fileInfo) {

			var file = fileInfo.file;
			var url = fileInfo.url;

			fileCount++;

			if (file.type.indexOf('image/') === 0) {
				responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
			}
			else if (file.type.indexOf('text/') === 0) {
				responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
			}
		}

		for (var n = 0, nLen = files.length; n < nLen; n++) {

			var fileReader = new FileReader();
			var defer = deferHASH.set(n, deferredLib.create());
			defers.push(defer);
			defer.then(handleFile);

			fileReader.onloadend = (function (deferKey, file) {
				return function (event) {
					if (event.target.readyState == FileReader.DONE) {
						deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
					}
				};
			})(n, files[n]);

			fileReader.readAsDataURL(files[n]);

		}

		return deferredLib.all(defers).then(function () {
			return ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, pkg.recipient) + responseHTML + "<hr/>";
		});
	}

	function transmissionListener(VM, event) {

		VM.$apply(function () {

			/**
			* Listen for transmissions
			*/
			ifclientLib.listen(event).then(function (pkg) {

				/**
				* clientLib list was updated
				*/
				if (pkg.type == packLib.const.CLIENT_LIST) {
					processClientListPackage (pkg).then(function (clients) {
						VM.contacts = clients;
						VM.recipient = VM.contacts [0];
					});
				}

				else if (pkg.type === packLib.const.TEXT_MESSAGE_TYPE) {
					processTextMessagePackage (pkg).then(function (text) {
						VM.response = $sce.trustAsHtml (text + VM.response);
					});
				}

				else if (pkg.type === packLib.const.FILE_TYPE) {
					processFilesPackage (pkg).then (function (text) {
						VM.response = $sce.trustAsHtml (text + VM.response);
					});
				}

				else { 
				}

			});
		});
	}

	return {
		restrict: 'E',
		controller: function ($scope, $window) {
			var VM = $scope;
			VM.username = ifclientLib.getUsername();
			VM.response = '';
			VM.contacts = '';
			VM.recipient = '';
			VM.message = '';
			VM.sendMessage = function () {
        
				if ($scope.recipient === 'ALL') {
					for (var n in $scope.contacts) {

						if (!$scope.contacts.hasOwnProperty(n)) {
							continue;
						}

						var oContact = $scope.contacts [n];
						if (oContact === 'ALL') {
							continue;
						}
						ifclientLib.sendMessage(oContact, $scope.message, false);
				  	}
				}
				else {
					ifclientLib.sendMessage($scope.recipient, $scope.message, false);
				}
			};

			VM.resetForm = function () {
				VM.message = '< Type a message / drag and drop a file into here >';
			};


			angular.element($window).on('message', function (event) {
				transmissionListener (VM, event);
			});
			
			VM.resetForm ();
		},
		template: '<h3>{{username}} (Powered by Angular 1.3)</h3>' + 
			'<div ng-bind-html = "response" class = "response"></div>' +
			'<p>' +
				'Contacts <select ng-model = "recipient">' +
				'<option ng-repeat = "contact in contacts" value = "{{contact}}">{{contact}}</option></p>' +
				'</select>' +
			'<p>' +
				'<textarea ng-model = "message"></textarea>' +
				'<br/><button ng-click = "sendMessage ()">Send</button> <button ng-click = "resetForm ()">Reset</button>' +
			'</p>'
	};
});

angular.module('ifclientApp').run(function (ifclientLib) {

  'use strict';

  ifclientLib.connect();
});