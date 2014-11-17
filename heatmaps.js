(function() {
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
	};
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
					// some things will be 0 when the totalTime in unknown
					// otherwise, a Date will be given

					// this tests if previously the totalTime was unknown, and now it is
					// not
					if (oldVal === 0 && newVal !== 0) {
						var startTime = $scope.$eval(attr.$attr.begin);
						var left = (startTime * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						if (left<100){
							elem.css("left", left + "%");
						} else if (left<0) {
							elem.css("left", "0%");
						}
		
						var val = $scope.$eval(attr.$attr.finish);
						var endTime = val;
						var right = ((API.totalTime.getTime() - endTime) * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						if(right>0 && right<100) {
							elem.css("right", right + "%");
						} else {
							elem.css("right", "0%");
						}

						var colours = $scope.$parent.$parent.heatmaps.colours;
						val = $scope.$eval(attr.$attr.frequency);
						var i = 0;
						while (i < colours.length){
							if (colours[i].upto === '+' || parseInt(val) < colours[i].upto) {
								elem.css("background-color", colours[i].colour);
								break;
							}
							i++;
						}
					}
				}
			);
		}
	};
}]);

})();
