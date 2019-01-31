$( document ).ready(function() {

	// Layer and Basemaps switcher control
	var map = L.map('map', {
		center: [48.133333, 11.566667],
		zoom: 11,
		layers: [Basemaps.Basemaps.DarkMatter, Basemaps.Basemaps.Wikimedia, Basemaps.Basemaps.OpenStreetMap_DE],
		zoomControl: false
		});		        
		        
	// Customized zoom control
	L.control.zoom({
     	position:'topright'
	}).addTo(map);

	// Use the custom grouped layer control, not "L.control.layers"
	L.control.groupedLayers(Basemaps.Basemaps).addTo(map);

	var MunchenBoundaries = L.geoJson(MunchenBoundaries).addTo(map);

	var FrameBoundary = map.fitBounds([
		[48.0616, 11.3608],
		[48.2482, 11.7229]
	]);

	var sidebar = L.control.sidebar('sidebar').addTo(map);
		    	
	$( ".button.open" ).click(function() {
		$(".form").addClass("unvisible");
		$(".form").removeClass("visible");
		$( ".button.close" ).removeClass( "hide" );
		$( ".button.open" ).addClass( "hide" ); 
	});

	$( ".button.close" ).click(function() {
		$(".form").addClass("visible");
		$(".form").removeClass("unvisible");
		$( ".button.open" ).removeClass( "hide" );
		$( ".button.close" ).addClass( "hide" );    
	});

	$( "#sidebar" ).hover(function() {
		map.dragging.disable();
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
		map.boxZoom.disable();
		map.keyboard.disable();
		},
		function() {
		map.dragging.enable();
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		map.boxZoom.enable();
		map.keyboard.enable();
		});

		        
	var start = null;
	var marker = null;
				
	//get current position, the spot selection function need to insert to it
	//for getting the click reaction, variable definition for Spot need to be in this function
	//navigator.geolocation.getCurrentPosition(function(location) {
	//	var start = new L.LatLng(location.coords.latitude, location.coords.longitude);
	//	var marker = L.marker(start).addTo(map);

	//init styles array
	var myStyles = initStyles();

	//Emotion Layer
	//Based on the last version, insert all codes
	var points_emotion = L.geoJson(emo_100_poly, {
		style:function(feature) {
		    return myStyles[Math.floor(feature.properties.score)];
		    }
	}).addTo(map);

	var sliderRangeSelector = $('#slider-range-selector-input').slider({
		id: 'slider-range-selector-input',
		min: 0,
		max: 10,
		step: 0.319803,
		value: [0, 10],
		rangeHighlights: [
		    //{id: "",  "start": 5.733887, "end": 6.053690, "class": "category1"},
			//{"start": 6.053690, "end": 6.373493, "class": "category2"},
			//{"start": 6.373493, "end": 6.693296, "class": "category3"},
			//{"start": 6.693296, "end": 7.013099, "class": "category4"},
			//{"start": 7.013099, "end": 7.332902, "class": "category5"},
			//{"start": 7.332902, "end": 7.652706, "class": "category6"},
			//{"start": 7.652706, "end": 7.972509, "class": "category7"},
			//{"start": 7.972509, "end": 8.292312, "class": "category8"},
			//{"start": 8.292312, "end": 8.612115, "class": "category9"},
			//{"start": 8.612115, "end": 8.931918, "class": "category10"},
			{id: "",  "start": 0, "end": 1, "class": "category1"},
			{"start": 1, "end": 2, "class": "category2"},
			{"start": 2, "end": 3, "class": "category3"},
			{"start": 3, "end": 4, "class": "category4"},
			{"start": 4, "end": 5, "class": "category5"},
			{"start": 5, "end": 6, "class": "category6"},
			{"start": 6, "end": 7, "class": "category7"},
			{"start": 7, "end": 8, "class": "category8"},
			{"start": 8, "end": 9, "class": "category9"},
			{"start": 9, "end": 10, "class": "category10"},
		    ],
		    formatter: function (value) {
		        return 'Current value: ' + value;
			}
	});

	$( "#submit-slider-range-selector" ).click(function() {
	// var myStyle = {
	//  "color": "red",
	//  "weight": 5,
	//  "opacity": 0.65
	// };
		points_emotion.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});

		var selectorValue = sliderRangeSelector.slider('getValue');

		points_emotion = L.geoJson(
			emo_100_poly,
			{
				style:function(feature) {
					return myStyles[Math.floor(feature.properties.score)];
				},
				filter: function (feature, layer) {
					return selectorValue[0] <= Math.floor(feature.properties.score) && selectorValue[1] > Math.floor(feature.properties.score);
				}
			}).addTo(map);
		addPointsInPolygons ();
	});

	function initStyles() {
		var styles = [];
		let colors = [
			'#67001f',
			'#a50026',
			'#d73027',
			'#f46d43',
			'#fdae61',
			'#fee08b',
			//'#d9ef8b',
			'#a6d96a',
			'#66bd63',
			'#006837',
			'#00441b',
		];
		for (let i = 1; i <= 10; i++) {
			let style = {
				// "color": getStyleRuleValue('color', "category"+i),
				"color": colors[i],
				"weight": 2,
				"opacity": 0.85
			};
			styles[i]=(style);
		}
		return styles;
	}
							
    var routeControl = L.Routing.control({
		waypoints: null,
		lineOptions: {
		 	styles:[{"color": "#ff7800","weight": 5,"opacity": 0.65}]
		}
	});
	// spots selection
	//initiate the spot points
	var Bar = L.geoJson(
		bar, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: BarIcon});
			}
		}
	);

	var Cafe = L.geoJson(
		cafe, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: CafeIcon});
			}
		}
	);

	var Club = L.geoJson(
		club, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: ClubIcon});
			}
		}
	);

	var Others = L.geoJson(
		others, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: OthersIcon});
			}
		}
	);

	//var Park = L.geoJson(park, { pointToLayer: function (feature, latlng) { 
	//return L.marker(latlng, {icon: ParkIcon});}});

	var Pub = L.geoJson(
		pub, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: PubIcon});
			}
		}
	);

	var Restauraunt = L.geoJson(
		restaurant, 
		{ 
			pointToLayer: function (feature, latlng) { 
				return L.marker(latlng, {icon: RestaurantIcon});
			}
		}
	);

	function addPointsInPolygons() {
		Bar.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});
		Cafe.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});
		Club.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});
		Others.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});
		//Park.getLayers().forEach(function(item, i, arr) {
		//	map.removeLayer(item);
		//});
		Pub.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});
		Restauraunt.getLayers().forEach(function(item, i, arr) {
			map.removeLayer(item);
		});

		if($('#Bar').is(':checked'))
		Bar = L.geoJson(
			bar, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: BarIcon});
				},
				filter: function (feature, layer) {
            		let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
	                return points_emotion.getLayers().some(function(element) 
	                	{
	                    	return element.getBounds().contains(newpoints) === true;
	                	}
	                )
                // return points_emotion.getBounds().contains(some);
				},
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);

		if($('#Cafe').is(':checked'))
		Cafe = L.geoJson(
			cafe, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: CafeIcon});
				},
				filter: function (feature, layer) {
                    let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    return points_emotion.getLayers().some(function(element) 
                    	{
                        	return element.getBounds().contains(newpoints) === true;
                    	}
                    )
                // return points_emotion.getBounds().contains(some);
                },
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);

		if($('#Club').is(':checked'))
		Club = L.geoJson(
			club, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: ClubIcon});
				},
				filter: function (feature, layer) {
                    let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    return points_emotion.getLayers().some(function(element) 
                    	{
                        	return element.getBounds().contains(newpoints) === true;
                    	}
                    );
                // return points_emotion.getBounds().contains(some);
                },
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);

		if($('#Others').is(':checked'))
		Others = L.geoJson(
			others, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: OthersIcon});
				},
				filter: function (feature, layer) {
                    let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    return points_emotion.getLayers().some(function(element) 
                    	{
                        	return element.getBounds().contains(newpoints) === true;
                    	}
                    );
                // return points_emotion.getBounds().contains(some);
                },
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);
		
		//if($('#Park').is(':checked'))
		//Park = L.geoJson(
		//	park, 
		//	{ 
		//		pointToLayer: function (feature, latlng) { 
		//			return L.marker(latlng, {icon: ParkIcon});
		//		},
		//		filter: function (feature, layer) {
		//			let NewPoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
		//			return points_emotion.getLayers().some(function(element) {
		//				return element.getBounds().contains(NewPonts) === true;
		//			});
		//			// return points_emotion.getBounds().contains(some);
		//		},
		//		onEachFeature: function (feature, layer) {
		//					layer.on('click', function(e) {onClick(e, start,routeControl);});
		//					if (feature.properties && feature.properties.name) {
		//							layer.bindPopup(feature.properties.name);}
		//		}
		//	}).addTo(map);
	
		if($('#Pub').is(':checked'))
		Pub = L.geoJson(
			pub, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: PubIcon});
				},
				filter: function (feature, layer) {
                    let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    return points_emotion.getLayers().some(function(element) 
                    	{
                        	return element.getBounds().contains(newpoints) === true;
                    	}
                    )
                // return points_emotion.getBounds().contains(some);
                },
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);
	   

		if($('#Restauraunt').is(':checked'))
		Restauraunt = L.geoJson(
			restaurant, 
			{ 
				pointToLayer: function (feature, latlng) { 
					return L.marker(latlng, {icon: RestaurantIcon});
				},
				filter: function (feature, layer) {
                    let newpoints = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    return points_emotion.getLayers().some(function(element) 
                    	{
                        	return element.getBounds().contains(newpoints) === true;
                    	}
                    )
                // return points_emotion.getBounds().contains(some);
                },
                onEachFeature: function (feature, layer) {
					layer.on('click', function(e) {onClick(e, start,routeControl);});
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(feature.properties.name);}
					}
				}
		).addTo(map);
	};

	$('input:checkbox[name="spots"]').change(function () {
		addPointsInPolygons();
	});

	function onEachFeature(feature, layer) {
		layer.on('click', function(e) {onClick(e)});
		if (feature.properties && feature.properties.name) {
			layer.bindPopup(feature.properties.name+"<br>"+feature.properties.Address)}
	}

	function filter (feature, layer) {
		let NewPonts = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
		return points_emotion.getLayers().some(function(element) {
			return element.getBounds().contains(NewPonts) === true;
		});
		// return points_emotion.getBounds().contains(some);
	}

	//click function
	function onClick(e){

		var end = e.latlng;
		if(start === null)
		{
			navigator.geolocation.getCurrentPosition(function(location) {
				start = new L.LatLng(location.coords.latitude, location.coords.longitude);
				marker = L.marker(start).addTo(map);
				setWaypoints(start, end)
			});
		}
		else
		{
			setWaypoints(start, end)
		}

		//var icon = L.icon({
        //iconUrl: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Azure.png',
        //iconSize: [ 48, 48 ],
		//});
		// var layer = e.target;
		//layer.setIcon(layer.options.icon = icon);
       //e.target.setIcon( new icon);
	}

	function setWaypoints(start, end)
	{
		routeControl.setWaypoints([L.latLng(start),L.latLng(end)]).addTo(map);
	}

	var geojsonMarkerOptions  = {
      radius: 6,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };

	var Icon = L.Icon.extend({
		options: {
		iconSize:     [30, 30]
	}
	});

	var BarIcon = new Icon({iconUrl: 'img/Bar.png'});
	var	CafeIcon = new Icon({iconUrl: 'img/Cafe.png'});
	var	ClubIcon = new Icon({iconUrl: 'img/Club.png'});
	var	PubIcon = new Icon({iconUrl: 'img/Pub.png'});
	var	RestaurantIcon = new Icon({iconUrl: 'img/Restaurant.png'});
	// var ParkIcon = new Icon({iconUrl: 'img/Park.png'});
	var	OthersIcon = new Icon({iconUrl: 'img/Others.png'});

});