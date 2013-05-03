var mapdata = { destination: new google.maps.LatLng(35.918026,-78.795795) };

function Map()
{
}

/**
 * Display the map showing the user position or the latter and the car position
 */
Map.displayMap = function(userPosition, carPosition)
{
   var userLatLng = null;
   var carLatLng = null;

   if (userPosition != null)
      userLatLng = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
   if (carPosition != null)
      carLatLng = new google.maps.LatLng(carPosition.position.latitude, carPosition.position.longitude);

   var options = {
      zoom: 20,
      disableDefaultUI: true,
      panControl: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true,
      navigationControl: true,
      center: userLatLng,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoomControlOptions: {
    	          position: google.maps.ControlPosition.TR,
    	        style: google.maps.ZoomControlStyle.SMALL
    	      }
      
   }
   var map = new google.maps.Map(document.getElementById('map'), options);
   var marker = new google.maps.Marker({
      position: userLatLng,
      map: map
     // title: 'Your position'
   }); 
   var infoWindowContent = [
                            "",
                            "<form id='map-form'>",
                            "<input class='clickeventvialive' id='map-go' type='button' value='Get Directions'/>",
                            "</form>"
                        ].join("");
   
   var infowindow = new google.maps.InfoWindow({
	    content: infoWindowContent
	    });
   google.maps.event.addListener(marker, 'click', function() {
	   infowindow.open(map, marker);
	  /* $('#map-go').click( function() { 
	        $.mobile.changePage($('#page-map'), {});
	    });*/
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			  //$.mobile.changePage($('#page-map'), {});
			   });
	 });

   // If carLatLng is null means that the function has been called when the
   // user set his current position and that is when he parked the car so the
   // icon will be shown accordingly.
   if (carLatLng == null)
      marker.setIcon('images/car-marker.png');
   else
      marker.setIcon('images/user-marker.png');
   var circle = new google.maps.Circle({
      center: userLatLng,
      radius: userPosition.coords.accuracy,
      map: map,
      fillColor: '#70E7FF',
      fillOpacity: 0.1,
      strokeColor: '#FFFFFF',
      strokeOpacity: 1.0
   });
   map.fitBounds(circle.getBounds());

   if (carLatLng != null)
   {
      marker = new google.maps.Marker({
         position: carLatLng,
         map: map,
         icon: 'images/car-marker.png',
         title: 'Car position'
      });
      circle = new google.maps.Circle({
         center: carLatLng,
         radius: carPosition.position.accuracy,
         map: map,
         fillColor: '#70E7FF',
         fillOpacity: 0.1,
         strokeColor: '#FFFFFF',
         strokeOpacity: 1.0
      });

      // Display route to the car
      options = {
         suppressMarkers: true,
         map: map,
         preserveViewport: true
      }
      this.setRoute(new google.maps.DirectionsRenderer(options), userLatLng, carLatLng);
   }

   //$.mobile.loading('hide');
}

/**
 * Calculate the route from the user to his car
 */
Map.setRoute = function(directionsDisplay, userLatLng, carLatLng)
{
   var directionsService = new google.maps.DirectionsService();
   var request = {
      origin: userLatLng,
      destination: carLatLng,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
   };

   directionsService.route(
      request,
      function(response, status)
      {
         if (status == google.maps.DirectionsStatus.OK)
            directionsDisplay.setDirections(response);
         else
         {
            navigator.notification.alert(
               'Unable to retrieve a route to your car. However, you can still find it by your own.',
               function(){},
               'Warning'
            );
         }
      }
   );
}

/**
 * Request the address of the retrieved location
 */
Map.requestLocation = function(position)
{
   new google.maps.Geocoder().geocode(
      {
         'location': new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      },
      function(results, status)
      {
         if (status == google.maps.GeocoderStatus.OK)
         {
            var positions = new Position();
            positions.updatePosition(0, positions.getPositions()[0].coords, results[0].formatted_address);
         }
      }
   );
}
function fadingMsg (locMsg) {
    $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
    .appendTo( $.mobile.pageContainer )
    .delay( 2200 )
    .fadeOut( 1000, function(){
        $(this).remove();
   });
}

//Create the map then make 'displayDirections' request
$('#page-map').live("pageinit", function() {
    $('#map_canvas').gmap({'center' : mapdata.destination, 
        'mapTypeControl' : true, 
        'navigationControl' : true,
        'navigationControlOptions' : {'position':google.maps.ControlPosition.LEFT_TOP}
        })
    .bind('init', function() {
        $('.refresh').trigger('tap');        
    });
});

$('#page-map').live("pageshow", function() {
    $('#map_canvas').gmap('refresh');
});

// Request display of directions, requires jquery.ui.map.services.js
var toggleval = true; // used for test case: static locations
$('.refresh').live("tap", function() {
    
            // START: Tracking location with device geolocation
           if ( navigator.geolocation ) { 
                fadingMsg('Using device geolocation to get current position.');
                navigator.geolocation.getCurrentPosition ( 
                    function(position) {
                        $('#map_canvas').gmap('displayDirections', 
                        { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                          'destination' : mapdata.destination, 'travelMode' : google.maps.DirectionsTravelMode.DRIVING},
                        { 'panel' : document.getElementById('dir_panel')},
                              function (result, status) {
                                  if (status === 'OK') {
                                      var center = result.routes[0].bounds.getCenter();
                                      $('#map_canvas').gmap('option', 'center', center);
                                      $('#map_canvas').gmap('refresh');
                                  } else {
                                    alert('Unable to get route');
                                  }
                              }
                           );         
                    }, 
                    function(){ 
                        alert('Unable to get location');
                        $.mobile.changePage($('#page-home'), {}); 
                    }); 
                } else {
                    alert('Unable to get location.');
                }            
            // END: Tracking location with device geolocation

            // START: Tracking location with test lat/long coordinates
            // Toggle between two origins to test refresh, force new route to be calculated
            /*var position = {};
            if (toggleval) {
                toggleval = false;
                position = { coords: { latitude: 57.6969943, longitude: 11.9865 } }; // Gothenburg
            } else {
                toggleval = true;
                position = { coords: { latitude: 58.5365967, longitude: 15.0373319 } }; // Motala
            }
            $('#map_canvas').gmap('displayDirections', 
                { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                  'destination' : mapdata.destination, 
                  'travelMode' : google.maps.DirectionsTravelMode.DRIVING },
                  { 'panel' : document.getElementById('dir_panel') },
                    function (result, status) {
                        if (status === 'OK') {
                            var center = result.routes[0].bounds.getCenter();
                            $('#map_canvas').gmap('option', 'center', center);
                            $('#map_canvas').gmap('refresh');
                        } else {
                            alert('Unable to get route');
                        }
                    });*/ 
            // END: Tracking location with test lat/long coordinates
    $(this).removeClass($.mobile.activeBtnClass);
    return false;
});

// Go to map page to see instruction detail (zoom) on map page
$('#dir_panel').live("tap", function() {
    $.mobile.changePage($('#page-map'), {});
});

// Briefly show hint on using instruction tap/zoom
$('#page-dir').live("pageshow", function() {
    fadingMsg("Tap any instruction<br/>to see details on map");
});