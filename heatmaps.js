'use strict';
angular.module('uk.ac.soton.ecs.videogular.plugins.heatmaps', [])

.directive('vgHeatmaps', [function() {
	return {
		restrict: 'E',
		require: '^videogular',
		templateUrl: 'bower_components/videogular-heatmap/heatmaps.html',
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
}])

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
						var startTime = new Date(val);
						var left = (startTime.getTime() * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						elem.css("left", left + "%");
		
						val = $scope.$eval(attr.$attr.finish);
						var endTime = new Date(val); 
						var right = ((API.totalTime.getTime() - endTime.getTime()) * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						elem.css("right", right + "%");
		
						var colours = $scope.$parent.$parent.heatmaps.colours;
						var val = $scope.$eval(attr.$attr.frequency);
						var i = 0;
						while (i < colours.length){
							if (colours[i].upto == '+' || parseInt(val) < colours[i].upto){
								elem.css("background-color", colours[i].colour);
								break;	
							}
							i++;
						}		
					}
				}
			);			
    	}
	}
}]);
