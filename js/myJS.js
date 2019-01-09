$( document ).ready(function() {

    var map = L.map('map').setView([48.133333, 11.566667], 11);
    //var OSMBackground = new L.tileLayer.provider('Wikimedia').addTo(map);
	var basemap = L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    var MunchenBoundaries = L.geoJson(MunchenBoundaries).addTo(map);
    var FrameBoundary = map.fitBounds([
        [48.0616, 11.3608],
        [48.2482, 11.7229]
    ]);
	
	
    var myStyles = initStyles();
    var points_emotion = L.geoJson(emo_100_poly, {
        style:function(feature) {
            return myStyles[Math.floor(feature.properties.score)];
        }}).addTo(map);
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

    var sliderRangeSelector = $('#slider-range-selector-input').slider({
        id: 'slider-range-selector-input',
        min: 0,
        max: 9,
        step: 1,
        value: [0, 9],
        rangeHighlights: [
            {id: "", "start": 0, "end": 1, "class": "category1"},
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

    

    //init styles array
    var myStyles = initStyles();
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
                    return selectorValue[0] <= Math.floor(feature.properties.score) && selectorValue[1] >= Math.floor(feature.properties.score);
                }
            }).addTo(map);
    });
	
    // spots selection
	var geojsonMarkerOptions = {
		radius: 3,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8 };
		
	var Bar = L.geoJson(bar, { pointToLayer: function (feature, latlng) { 
	    return L.circleMarker(latlng, geojsonMarkerOptions);}}).addTo(map);
		
		$('input:checkbox[name="spots"]').change(function () {
			var layers = [];

			if ($('#' + $(this).attr('id')).is(':checked')) {
				$('input:checkbox[name="spots"]').each(function () {
					// Remove all overlay layers
					map.removeLayer(window[$(this).attr('id')]);
					if ($('#' + $(this).attr('id')).is(':checked')) {
						// Add checked layers to array for sorting
						layers.push({
							'layer': $(this)
						});
					}
				});
				// Loop through layers array and add to map in correct order
				$.each(layers, function () {
					map.addLayer(window[$(this)[0].layer[0].id]);
				});
			} 
			else {
				// Simply remove unchecked layers
				map.removeLayer(window[$(this).attr('id')]);
			}
		});
    
	//Route Generation
	
	
	//get users' location
	navigator.geolocation.getCurrentPosition(function(location) {
		var my_location = new L.LatLng(location.coords.latitude, location.coords.longitude);
		var marker = L.marker(my_location).addTo(map);
	});
	

});

function initStyles() {
    var styles = [];
    let colors = [
        '#ff0000',
        '#d13632',
        '#e2571e',
        '#EC883A',
        '#e69333',
        '#D1D22C',
        '#ffff00',
        '#96bf33',
        '#479e1b',
        '#54f920',

    ];
    for (let i = 1; i <= 10; i++) {
        let style = {
            // "color": getStyleRuleValue('color', "category"+i),
            "color": colors[i],
            "weight": 2,
            "opacity": 0.65
        };
        styles[i]=(style);
    }
    return styles;
}



