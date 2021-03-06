videogular-heatmap
==================

Videogular Heatmap is a [Videogular](http://videogular.com/) plugin for displaying a heatmap on the scrub bar positioned in areas of the video that have been watched and coloured by the number of times that the area has been viewed.

Usage
-----

First, import the JavaScript file `heatmaps.js`, then add the dependency `uk.ac.soton.ecs.videogular.plugins.heatmaps` to your Angular project.

Next, add a `<vg-heatmaps>` element as a child of the `<vg-scrubbar>` of your Videogular player. Its `vg-heatmaps-config` attribute should be an object in your parent scope containing the heatmaps (see below), and the `vg-heatmaps-theme` attribute should point to the URL of a CSS file, just like Videogular's [`vg-theme` attribute](https://github.com/2fdevs/videogular/wiki/Themes).

For example, [Videogular's example 2](http://videogular.com/examples/example02.html) with a heatmap added would look like this:

```html
<videogular vg-player-ready="onPlayerReady" vg-theme="config.theme.url">
	<vg-video vg-src="config.sources"></vg-video>

	<vg-controls vg-autohide="config.autoHide" vg-autohide-time="config.autoHideTime">
		<vg-play-pause-button></vg-play-pause-button>
		<vg-timedisplay>{{ API.currentTime | date:'mm:ss' }}</vg-timedisplay>
		<vg-scrubBar>
			<vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
			<vg-heatmaps vg-heatmaps-config="config.plugins.heatmaps" vg-heatmaps-theme="config.plugins.heatmaps.theme.url"></vg-heatmaps>
		</vg-scrubBar>
		<vg-timedisplay>{{ API.timeLeft | date:'mm:ss' }}</vg-timedisplay>
		<vg-volume>
			<vg-mutebutton></vg-mutebutton>
			<vg-volumebar></vg-volumebar>
		</vg-volume>
		<vg-fullscreenButton></vg-fullscreenButton>
	</vg-controls>
</videogular>
```

With the following added to your `$scope.config` object:

```js
plugins: {
	heatmaps: {
		theme: {
			url: "heatmaps.css",
				// Replace with the path appropriate to your project
			showtext: true,
				//replace with false if you do not want the frequencies to show on the scrub bar
		},
		sections: [
					{
						start: '0',
						end: '1000',
						frequency : '4'
					},
					{
						start: '1000',
						end: '3000',
						frequency : '2'
					},
					{
						start: '3000',
						end: '4000',
						frequency : '1'
					},
					{
						start: '4000',
						end: '11000',
						frequency : '11'
					},
				],
		colours: [
					{
						upto: '2',
						colour: 'indigo',
					},
					{
						upto: '4',
						colour: 'blue',
					},
					{
						upto: '6',
						colour: 'green',
					},
					{
						upto: '8',
						colour: 'yellow',
					},
					{
						upto: '10',
						colour: 'orange',
					},
					{
						upto: '+',
						colour: 'red',
					},
				],
	},
},
```
As shown for setting a colour above the final limit use `'+'` in the `upto` field.
