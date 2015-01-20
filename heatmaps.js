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
			showFreq: '@',
			config: '=',
		},
		link: function($scope, elem, attr, API) {
			$scope.$watch(
				function () {
					return API.totalTime;
				},
				function (newVal, oldVal) {
					// some things will be 0 when the totalTime in unknown
					// otherwise, a Date will be given
					// this tests if previously the totalTime was unknown, and now it is not
					if (oldVal === 0 && newVal !== 0) {
						$scope.updateHeatmap();
					}
				}
			);

			//from http://jsfiddle.net/cZNRZ/
			$scope.invertColour=function (rgbString) {
				if (rgbString !== 'transparent'){
				
    			var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    
   				parts.splice(0, 1);
    			for (var i = 1; i < 3; ++i) {
        			parts[i] = parseInt(parts[i], 10);
    			}
    			var rgb = 'rgb(';
    			$.each(parts, function (idx, item) {
        			rgb += (255-item)+',';
    			});
    			rgb = rgb.slice(0, -1);
    			rgb += ')';
    			return rgb;
				} else {
					return "black";
				}
			};

			$scope.updateHeatmap = function(){
				if (API.totalTime == 0){
					return;
				}
				var startTime = $scope.$eval(attr.$attr.begin);
				var left = (startTime/API.totalTime.getTime()) *100;
				if (left<0){
					elem.css("left", "0%");
				} else if (left<100) {
					elem.css("left", left + "%");
				} 
		
				var endTime = $scope.$eval(attr.$attr.finish);
				var right = ((API.totalTime.getTime() - endTime)/ (API.totalTime.getTime()))*100;
				if(right>100) {
					elem.css("right", "100%");
				} else if (right >= 0) {
					elem.css("right", right + "%");
				} else if (right < 0) {
					elem.css("right", "100%");
				}

				var colours = $scope.config.colours;
				var val = $scope.$eval(attr.$attr.frequency)
				var i = 0;
				while (i < colours.length){
					if (colours[i].upto === '+' || parseInt(val) < colours[i].upto) {
						elem.css("background-color", colours[i].colour);
						if($scope.showFreq){
							elem.css("color", $scope.invertColour(elem.css('background-color')));
						} else {
							elem.css("color", 'transparent');
						}
						break;
					}
					i++;
				}
			}
			$scope.updateHeatmap();

		}
	};
}]);

})();
