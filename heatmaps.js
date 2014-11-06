'use strict';
angular.module('uk.ac.soton.ecs.videogular.plugins.heatmaps', 
['uk.ac.soton.ecs.videogular.plugins.heatmaps.completed'])

.directive('vgHeatmaps', ["VG_STATES", function(VG_STATES) {
	return {
		restrict: 'E',
		require: '^videogular',
		templateUrl: 'heatmaps.html',
		scope: {
			heatmaps: '=vgHeatmapsConfig',
			theme: '=vgHeatmapsTheme',
		},
		link: function($scope, elem, attr, API) {
			// shamelessly stolen from part of videogular's updateTheme function
			function updateTheme(value) {
				if (value) {
					var headElem = angular.element(document).find("head");
					headElem.append("<link rel='stylesheet' href='" + value + "'>");
				}
			}
			updateTheme($scope.theme);
		}
	}
}]);

angular.module('uk.ac.soton.ecs.videogular.plugins.heatmaps.completed', [])
.directive('vgCompletedHeatmap',[function() {
	return {
		restrict: 'E',
		require: '^videogular',
		scope: {
			begin: '@',
			finish: '@',
			frequency: '@',
		},
		link: function($scope, elem, attr, API) {
			$scope.$watch(
				function () {
					return API.totalTime;
				},
				function (newVal, oldVal) {	
					if (newVal !== 0 && (oldVal == 0 || newVal.getTime() != oldVal.getTime())){
						var val = $scope.$eval(attr.$attr.begin);
						var startTime = new Date(val.substr(5,val.length-5));
						var left = (startTime.getTime() * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						elem.css("left", left + "%");
		
						val = $scope.$eval(attr.$attr.finish);
						var endTime = new Date(val.substr(5,val.length-5));
						console.log(endTime);
						var right = ((API.totalTime.getTime() - endTime.getTime()) * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						elem.css("right", right + "%");
		
						var val = $scope.$eval(attr.$attr.frequency);
						if (val == 1){
							elem.css("background-color", "indigo");
						} else if (val < 4){
							elem.css("background-color", "blue");
						} else if (val < 6){
							elem.css("background-color", "green");
						} else if (val < 8){
							elem.css("background-color", "yellow");
						} else if (val < 10){
							elem.css("background-color", "orange");
						} else {
							elem.css("background-color", "red");
						}		
					}
				}
			);			
    	}
	}
}]);
