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
   var requestType = urlParam('requestType');
   if (userPosition != null)
      userLatLng = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
   if (carPosition != null)
      carLatLng = new google.maps.LatLng(carPosition.position.latitude, carPosition.position.longitude);
   var zoom = 10;
   if (requestType == 'set'){ 
	   zoom = 20;
   }
   var options = {
      zoom: zoom,
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
   }); 
   var infoWindowContent = [
                            "",
                            "<form id='map-form'>",
                            "<input class='clickeventvialive' id='map-go' type='button' style='width:200px; height:70px;' value='Get Directions'/>",
                            "</form>"
                        ].join("");
   
   var infowindow = new google.maps.InfoWindow({
	    content: infoWindowContent
	    });
   google.maps.event.addListener(marker, 'click', function() {
	   infowindow.open(map, marker);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });
	 });

   //fadingMsg("Searching");
   // If carLatLng is null means that the function has been called when the
   // user set his current position and that is when he parked the car so the
   // icon will be shown accordingly.
   if (carLatLng == null)
      marker.setIcon('images/car-marker.png');
   else
      marker.setIcon('images/user-marker1.png');
   //CREATE TEST MARKERS only for requestType = set---------------------------------
   if (requestType != 'set'){
   var carLatLng1 = new google.maps.LatLng(35.778046,-78.679448);
   var marker1 = new google.maps.Marker({
	      position: carLatLng1,
	      map: map,
	      icon: 'images/red.png'}); 
   google.maps.event.addListener(marker1, 'click', function() {
	   infowindow.open(map, marker1);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });});
   
   var carLatLng2 = new google.maps.LatLng(35.777556,-78.678955);
   var marker2 = new google.maps.Marker({
	      position: carLatLng2,
	      map: map,
	      icon: 'images/red.png'}); 
   google.maps.event.addListener(marker2, 'click', function() {
	   infowindow.open(map, marker2);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });});
   
   var carLatLng3 = new google.maps.LatLng(35.777994,-78.679222);
   var marker3 = new google.maps.Marker({
	      position: carLatLng3,
	      map: map,
	      icon: 'images/red.png'}); 
   google.maps.event.addListener(marker3, 'click', function() {
	   infowindow.open(map, marker3);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });});
   
   var carLatLng4 = new google.maps.LatLng(35.77804,-78.679452);
   var marker4 = new google.maps.Marker({
	      position: carLatLng4,
	      map: map,
	      icon: 'images/red.png'}); 
   google.maps.event.addListener(marker4, 'click', function() {
	   infowindow.open(map, marker4);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });});
   
   var carLatLng5 = new google.maps.LatLng(35.777843,-78.679065);
   var marker5 = new google.maps.Marker({
	      position: carLatLng5,
	      map: map,
	      icon: 'images/red.png'}); 
   google.maps.event.addListener(marker5, 'click', function() {
	   infowindow.open(map, marker5);
	   $(".clickeventvialive").bind("click", function (){		  
			   $.mobile.changePage('directions.html');
			   });});
   }
   //--------------------------------------------------
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

function fadingMsg (locMsg) {
	 $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
	 .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
	 .appendTo( $.mobile.pageContainer )
	 .delay( 2200 )
	 .fadeOut( 1000, function(){
	     $(this).remove();
	});
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
