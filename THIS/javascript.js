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
var options = {enableHighAccuracy: true};
var infowindow = new google.maps.InfoWindow();
var markers = [];

window.setInterval(function(){
	var watchID = navigator.geolocation.watchPosition(showPosition, onError, options);
}, 2000);

navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

// Reloads map and creates user location marker
function showLocation(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
}

// Inits map and creates user location marker
function onSuccess(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	//Google Maps
	var myLatlng = new google.maps.LatLng(lat,lng);
	var mapOptions = {zoom: 16,center: myLatlng}
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var marker = new google.maps.Marker({
		position: myLatlng,
		icon: 'https://image.ibb.co/j8F82F/user_icon.png',
		map: map
	});
	
	// Create a <script> tag and set the USGS URL as the source.
	var script = document.createElement('script');
	// This example uses a local copy of the GeoJSON stored at
	// http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
	script.src = 'dsec-5y6t.geojson';
	document.getElementsByTagName('head')[0].appendChild(script);

	window.eqfeed_callback = function(results) {
		for (var i = 0; i < results.features.length; i++) {
			var coords = results.features[i].geometry.coordinates;
			var latLng = new google.maps.LatLng(coords[1],coords[0]);
			markers[i] = new google.maps.Marker({
				position: latLng,
				icon: 'https://image.ibb.co/iR3Vzv/toilet_map.png',
				map: map
			});
       			
			(function(marker,i){
				// infowindow content
				var contentString = '<p>This is a toilet</p>' + '</br>' + '<p>The coordinates are: </p>' + marker.position;

				google.maps.event.addListener(marker, 'click', function(){ 
					infowindow.close();
					// Updates the content of the infowindow before opening it
					infowindow.setContent(contentString);
					infowindow.open(map, marker);
				}); 
			}(markers[i],i));
		}
	}
}

// User location marker
function showPosition(position){
	var updatedLat = position.coords.latitude;
	var updatedLng = position.coords.longitude;
	var myUpdatedlatlng = new google.maps.LatLng(updatedLat, UpdatedLng);
	var marker = new google.maps.Marker({
		position: myUpdatedlatlng,
		icon: 'https://image.ibb.co/j8F82F/user_icon.png',
		map: map
	});
}
function onError(error) {
	alert('code: ' + error.code + '\n' +
	'message: ' + error.message + '\n');
} 	

google.maps.event.addDomListener(window, 'load', onSuccess);
