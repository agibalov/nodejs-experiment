angular.module("app", [
	"ngRoute", 
	"ui.bootstrap",
	"notes", 
	"categories",
	"api"])
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.otherwise({	
		redirectTo: "/notes"
	});
}])
.config(["$provide", function($provide) {
	$provide.decorator("$exceptionHandler", ["$delegate", "$injector", function($delegate, $injector) {
		return function(exception, cause) {
			$delegate(exception, cause);

			var apiService = $injector.get("apiService");
			var $modal = $injector.get("$modal");

			var errorMessage;
			if(exception instanceof apiService.ConnectivityError) {
				errorMessage = "There's a connectivity issue";
			} else if(exception instanceof apiService.ValidationError) {
				errorMessage = "There's a validation error";
			} else if(exception instanceof apiService.UnexpectedError) {
				errorMessage = "There's an unexpected API error: " + exception.message;
			} else {
				errorMessage = exception.message;
			}
			
			var modalInstance = $modal.open({
				templateUrl: "error-modal.html",
				controller: "ErrorModalController",
				resolve: {
					errorMessage: function() {
						return errorMessage;
					}
				}
			});

			modalInstance.result.then(function(result) {
				console.log("Error modal closed with success");
				console.log(result);
			}, function(error) {
				console.log("Error modal closed with error");
				console.log(error);
			});
		};
	}]);
}])
.controller("AppController", ["$scope", "$location", function($scope, $location) {
	$scope.isNavBarActive = function(navBarName) {
		var path = $location.path();
		
		if(path === "/notes" && navBarName === "notes") {
			return true;
		}

		if(path === "/categories" && navBarName === "categories") {
			return true;
		}

		return false;
	};
}])
.controller("ErrorModalController", [
	"$scope", 
	"$modalInstance", 
	"errorMessage", 
	function($scope, $modalInstance, errorMessage) {
		$scope.errorMessage = errorMessage;

		$scope.closeErrorModal = function() {
			$modalInstance.close("hi there - no error");
			// $modalInstance.dismiss("hi there - dismissed");
		};
	}
]);
