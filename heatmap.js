'use strict';
angular.module('uk.ac.soton.ecs.videogular.plugins.heatmap', [])
.directive('vgHeatmap', [function() {
	return {
		restrict: 'E',
		require: '^videogular',
		templateUrl: 'heatmap.html',
		scope: {
			heatmaps: '=vgHeatmapConfig',
			theme: '=vgHeatmapTheme',
		},
		link: function($scope, elem, attr, API) {
			// shamelessly stolen from part of videogular's updateTheme function
			function updateTheme(value) {
				if (value) {
					var headElem = angular.element(document).find("head");
					headElem.append("<link rel='stylesheet' href='" + value + "'>");
				}
			}

			$scope.calcLeft = function(heatmap) {
				var videoLength = API.totalTime.getTime() / 1000;
				return (cuepoint.time * 100 / videoLength).toString();
			};

			updateTheme($scope.theme);
		},
	};
}]);

