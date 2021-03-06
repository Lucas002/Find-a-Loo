// Get the modal
var modal = document.getElementById('id01');
var modal = document.getElementById('id02');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

$( document ).ready(function() {
	$( ".cross" ).hide();
	$( ".menu" ).hide();
	$( ".hamburger" ).click(function() {
	$( ".menu" ).toggle( "slide", { direction: "right" }, 600, function() {
	$( ".hamburger" ).hide();
	$( ".cross" ).show();
	});
	});
	$( ".cross" ).click(function() {
	$( ".menu" ).toggle( "slide", { direction: "right" }, 600, function() {
	$( ".cross" ).hide();
	$( ".hamburger" ).show();
	});
	});
});



function myFunction() {
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
}


// Map GeoLocation
var map;
var lat = undefined;
var lng = undefined;
var options = {enableHighAccuracy: true};
var infowindow = new google.maps.InfoWindow();
var markers = [];

// Get geo coordinates

function getMapLocation() {

    navigator.geolocation.getCurrentPosition
    (onMapSuccess, onMapError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {

    lat = position.coords.latitude;
    lng = position.coords.longitude;

    getMap(lat, lng);

    // Create a <script> tag and set the USGS URL as the source
    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at:
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src = 'convertcsv.geojson';
    document.getElementsByTagName('head')[0].appendChild(script);

    window.eqfeed_callback = function(results) {
        for (var i = 0; i < results.features.length; i++) {
            var coords = results.features[i].geometry.coordinates;
            var latLng = new google.maps.LatLng(coords[1],coords[0]);
            var name = results.features[i].properties.name;
            var info = results.features[i].properties.info;
            var img = results.features[i].properties.img;
            var directions = 'https://www.google.com/maps/dir/?api=1&origin='+myLatlng+'&destination='+latLng+'&travelmode=walking';
            markers[i] = new google.maps.Marker({
                position: latLng,
                icon: 'https://image.ibb.co/iR3Vzv/toilet_map.png',
                map: map
            });
            
            //displayOverlayImage2(img);
                
            (function(marker,i){
                // infowindow content
                var contentString = '<div id="iw-container">' + '<div class="iw-title">'+ name + '</div>' + '<div class="iw-content">' + 
                '<div class="iw-subTitle">'+ info + '<img src='+ img +'>' + '</div>' + '</div>' + '</div>';

                google.maps.event.addListener(marker, 'click', function(){ 
                    calculateAndDisplayRoute(directionsService, directionsDisplay, myLatlng, marker.position);
                    infowindow.close();
                    // Updates the content of the infowindow before opening it
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                }); 
            }(markers[i],i));
        }
    }

}

// Get map by using coordinates

function getMap(lat, lng) {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var myLatlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        icon: 'https://image.ibb.co/j8F82F/user_icon.png',
        map: map,
        title: 'Current Position'
    });

    marker.setMap(map);
    map.setZoom(16);
    map.setCenter(marker.getPosition());
}

// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

    var updatedLat = position.coords.latitude;
    var updatedLng = position.coords.longitude;

    if (updatedLat != lat && updatedLng != lng) {

        lat = updatedLat;
        lng = updatedLng;

        getMap(updatedLat, updatedLng);
    }
}

// Error callback

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchMapPosition() {

    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}


function on() {
	document.getElementById("overlay").style.display = "block";
}

function off() {
	document.getElementById("overlay").style.display = "none";
}

function displayOverlayImage2(image){
	postscribe('#overlayImage', '<script>displayOverlayImage();</script>');
	//document.write("<img src='" + displayImage + "'>");
	//document.getElementById('overlayImage .image').innerHTML = "src='" + img + "'";
}

function displayOverlayImage(image){
	var displayImage = image;
	document.write("<img src='" + displayImage + "'>");
}

// takes the two direction handlers and to and from coords to draw to map
function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, dest) {
        directionsService.route({
          origin: origin,
          destination: dest,
          travelMode: 'WALKING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

/*
 * The google.maps.event.addListener() event waits for
 * the creation of the infowindow HTML structure 'domready'
 * and before the opening of the infowindow defined styles
 * are applied.
 */
google.maps.event.addListener(infowindow, 'domready', function() {

    // Reference to the DIV which receives the contents of the infowindow using jQuery
    var iwOuter = $('.gm-style-iw');

    // Existing reference to .gm-style-iw for the previous DIV with .prev()
    var iwBackground = iwOuter.prev();

    // Remove the background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Remove the white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

	// Changes the desired tail shadow color
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 0px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '1', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});
	

});

// User location marker
/*function showPosition(position){
	var updatedLat = position.coords.latitude;
	var updatedLng = position.coords.longitude;
	var myUpdatedlatlng = new google.maps.LatLng(updatedLat, updatedLng);
	var marker = new google.maps.Marker({
		position: myUpdatedlatlng,
		icon: 'https://image.ibb.co/j8F82F/user_icon.png',
		map: map
	});
}*/
/*function onError(error) {
	alert('code: ' + error.code + '\n' +
	'message: ' + error.message + '\n');
} 	*/

//google.maps.event.addDomListener(window, 'load', onMapSuccess);
