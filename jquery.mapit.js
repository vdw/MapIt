/**
 * MapIt
 *
 * @copyright	Copyright 2013, Dimitris Krestos
 * @license		Apache License, Version 2.0 (http://www.opensource.org/licenses/apache2.0.php)
 * @link			http://vdw.staytuned.gr
 * @version		v0.0.1
 */

/* Available options
 *
 * Map type: 	ROADMAP, SATELLITE, HYBRID, TERRAIN
 * Map styles: false, GRAYSCALE
 *
 */

	/* Sample html structure

	<div id='map_canvas'></div>

	*/


document.write('<scr'+'ipt type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&language=el" ></scr'+'ipt>');

;(function($, window, undefined) {
	"use strict";

	$.fn.mapit = function(options) {

		var defaults = {
			latitude: 	37.9792,
			longitude: 	23.751344,
			zoom: 			14,
			type: 			'ROADMAP',
			marker: {
				latitude: 	37.9792,
				longitude: 	23.751344,
				icon: 			'images/marker.png',
				title: 			'Marker title',
				open: 			false
			},
			address: '<h2>The Title</h2><p>Address 1, Area - County<br />Athens 111 11, Greece</p><p>Tel.: +30 210 123 4567<br />Fax: +30 210 123 4567</p>',
			styles: 'GRAYSCALE',
			locations: []
		};

		var options = $.extend(defaults, options);

		$(this).each(function() {

			var $this = $(this);

				// Locations
				var locations = [
					['Metropolitan Expo','', 'CC', 37.955297, 23.956861, 4, 'yellow'],
					['MEC SA', 'Μεσογειακό Εκθεσιακό Κέντρο', 'CC', 37.975327, 23.853106, 5, 'yellow'],
					['E.Κ.Ε.Π', '', 'CC', 38.065798, 23.760481, 3, 'yellow'],
					['Εκθεσιακό Κέντρο Helexpo ', '', 'CC', 38.058905, 23.797531, 2, 'yellow'],
				];

				// Origins
				var athens  = ['37.983715', '23.72931'];
				var piraeus = ['37.947091', '23.64261'];
				var airport = ['37.943072', '23.950306'];

				// Init Map
				var directionsDisplay = new google.maps.DirectionsRenderer();

				var mapOptions = {
					scaleControl: false,
					center: new google.maps.LatLng(options.latitude, options.longitude),
					zoom: options.zoom,
					mapTypeId: eval('google.maps.MapTypeId.' + options.type)
				};
				var map = new google.maps.Map(document.getElementById($this.attr('id')), mapOptions);
				directionsDisplay.setMap(map);

				// Styles
				if (options.styles) {
					var GRAYSCALE_style = [
						{
							featureType: "all",
							elementType: "all",
							stylers: [
								{ saturation: -100 }
							]
						}
					];
					var mapType = new google.maps.StyledMapType(eval(options.styles + '_style'), { name: options.styles });
					map.mapTypes.set(options.styles, mapType);
					map.setMapTypeId(options.styles);
				}

				// Home Marker
				var home = new google.maps.Marker({
					map: map,
					//position: map.getCenter()
					position: new google.maps.LatLng(options.marker.latitude, options.marker.longitude),
					icon: new google.maps.MarkerImage(options.marker.icon),
					title: options.marker.title
				});

				// Add info on the home marker
				var info = new google.maps.InfoWindow({
					content: options.address
				});

				// Open the info window immediately
				if (options.marker.open) {
					info.open(map, home);
				} else {
					google.maps.event.addListener(home, 'click', function() {
						info.open(map, home);
					});
				};

				// Create Markers
				var infowindow = new google.maps.InfoWindow();
				var marker, i;
				var markers = [];

				for (i = 0; i < locations.length; i++) {

					// Add Markers
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(locations[i][3], locations[i][4]),
						map: map,
						icon: new google.maps.MarkerImage('images/'+locations[i][6]+'_marker.png')
					});

					// Create an array of the markers
					markers.push(marker);

					// Init info for each marker
					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							infowindow.setContent(locations[i][0]+"<br />"+locations[i][1]);
							infowindow.open(map, marker);
						}
					})(marker, i));

				}

				// Directions
				var directionsService = new google.maps.DirectionsService();

				function route(origins) {
					var request = {
						origin: new google.maps.LatLng(eval(origins)[0], eval(origins)[1]),
						destination: new google.maps.LatLng(38.074185, 23.818928),
						travelMode: google.maps.TravelMode.DRIVING
					};
					directionsService.route(request, function(result, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(result);
						}
					});
				}

				// Hide Markers Once (helper)
				function hide_all() {
					for (var i=0; i<locations.length; i++) {
						markers[i].setVisible(false);
					}
				}

				// Show Markers Per Category (helper)
				function show(category) {
					hide_all();
					reset();
					for (var i=0; i<locations.length; i++) {
						if (locations[i][2] == category) {
							markers[i].setVisible(true);
						}
					}
				}

				// Hide Markers Per Category (helper)
				function hide(category) {
					for (var i=0; i<locations.length; i++) {
						if (locations[i][2] == category) {
							markers[i].setVisible(false);
						}
					}
				}

				// Clear Markers (helper)
				function clear() {
					if (markers) {
						for (var i = 0; i < markers.length; i++ ) {
							markers[i].setMap(null);
						}
					}
				}

				function reset() {
					map.setCenter(new google.maps.LatLng(38.076220, 23.825552), 14);
				}

				// Hide all locations once
				hide_all();

		});

	};

	$(document).ready(function () { $('[data-toggle="mapit"]').mapit(); });

})(jQuery);