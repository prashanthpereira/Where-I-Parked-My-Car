var mapdata = { destination: new google.maps.LatLng(35.778046,-78.679448) };  //CC

function fadingMsg (locMsg) {
 $("<div class='ui-overlay-shadow ui-body-e ui-corner-all fading-msg'>" + locMsg + "</div>")
 .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
 .appendTo( $.mobile.pageContainer )
 .delay( 2200 )
 .fadeOut( 1000, function(){
     $(this).remove();
});
}


$('#page-map').live("pageinit", function() {
	
 $('#map_canvas').gmap({'center' : mapdata.destination, 
	 'zoom': 20,
	 'zoomControl': true,
	 'overviewMapControl': true,
	 'streetViewControl': true,
	 'mapTypeControl' : true, 
     'navigationControl' : true,
     'navigationControlOptions' : {'position':google.maps.ControlPosition.LEFT_TOP},
     'mapTypeId': google.maps.MapTypeId.SATELLITE,
     'zoomControlOptions': {
	          position: google.maps.ControlPosition.TR,
	        style: google.maps.ZoomControlStyle.SMALL
	      }
     })
 .bind('init', function() {
     $('.refresh').trigger('tap');        
 });
});

$('#page-map').live("pageshow", function() {
 $('#map_canvas').gmap('refresh');
});


var toggleval = true; // used for test case: static locations
$('.refresh').live("tap", function() {
 
         
         var position = {};
        
             position = { coords: { latitude: 35.773188, longitude: -78.683395 } };  // Avent Ferry road
            
       
         
         $('#map_canvas').gmap('displayDirections', 
             { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
               'destination' : mapdata.destination, 
               'travelMode' : google.maps.DirectionsTravelMode.DRIVING },
               { 'panel' : document.getElementById('dir_panel') },
                 function (result, status) {
                     if (status === 'OK') {
                    	 //document.getElementById('dir_panel').setDirections(result);
                    	// fadingMsg("status = OK");
                         var center = result.routes[0].bounds.getCenter();
                         $('#map_canvas').gmap('option', 'center', center);
                         $('#map_canvas').gmap('refresh');
                         
                     } else {
                         alert('Unable to get route');
                     }
                 }); 
         // END:
 $(this).removeClass($.mobile.activeBtnClass);
 return false;
});




$('#dir_panel').live("tap", function() {
 $.mobile.changePage($('#page-map'), {});
});

$('#directions-image').live("tap", function() {
	$.mobile.changePage("directions.html");
	});


$('.directions').live("tap", function() {
	 $.mobile.changePage("directions2.html");
	});


//
$('#page-dir').live("pageshow", function() {
	
 fadingMsg("Tap any instruction<br/>to see details on map");
});

