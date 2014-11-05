'use strict';
angular.module('uk.ac.soton.ecs.videogular.plugins.heatmaps', [])

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

			function onUpdateState(newState, videoTime) {
				switch (newState) {
					case VG_STATES.PLAY:
						eventsToPeriods('play', API.currentTime);
						break;
					case VG_STATES.STOP:
						eventsToPeriods('stop', API.currentTime);		
						break;
					case VG_STATES.PAUSE:
						eventsToPeriods('pause', API.currentTime);
						break;
				}
			}

			$scope.periods = [];
			$scope.currentPeriod = {};

			function eventsToPeriods(name,time) {
				var i = 0;
				
				if (name == "play"){
					$scope.currentPeriod.start = new Date(time);
				} else {
					$scope.currentPeriod.end = new Date(time);
					if ($scope.currentPeriod.start !== undefined){
						$scope.periods.push($scope.currentPeriod);
					}
					$scope.currentPeriod = {};
				}		
			}

			$scope.$watch(
				function () {
					return API.currentState;
				},
				function (newVal, oldVal) {
					if (newVal != oldVal) {
						onUpdateState(newVal, API.currentTime);
					}
				}
			);
		},
	};
}])

.directive('vgCompletedheatmap',[function() {
	return {
		restrict: 'E',
		require: '^videogular',
		link: function(scope, elem, attr, API) {
			
		}
	}
}])

.directive('vgHeatmap', [function() {
	return {
		restrict: 'E',
		require: '^videogular',
		link: function($scope, elem, attr, API) {
			var left = 0;

			function startPercent(startVal) {
				if (startVal !== undefined){
					left = (startVal * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);		
				}
				elem.css("left", left + "%");
			}

			var percentTime = 0;

			function onUpdateTime(newCurrentTime) {
				if (newCurrentTime && API.totalTime) {
					percentTime = (newCurrentTime.getTime() * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000) - left;
					elem.css("width", percentTime + "%");
				}
			}

			function onComplete() {
				percentTime = 0;
				elem.css("width", percentTime + "%");
			}

			$scope.$watch(
				function () {
					return API.currentTime;
				},
				function (newVal, oldVal) {
					onUpdateTime(newVal);
				}
			);

			$scope.$watch(
				function () {
					return $scope.currentPeriod.start;
				},
				function (newVal, oldVal) {
					console.dir($scope.currentPeriod);
					startPercent(newVal);
				}
			);

			$scope.$watch(
				function () {
					return API.isCompleted;
				},
				function (newVal, oldVal) {
					onComplete(newVal);
				}
			);
		}
	}
}]);
