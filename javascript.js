// Get the modal
var modal = document.getElementById('id01');
var modal = document.getElementById('id02');
var modal = document.getElementById('id03');
var modal = document.getElementById('id04');

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
var map = null;
var options = {enableHighAccuracy: true};
var infowindow = new google.maps.InfoWindow();
var marker = null;
var markers = [];
var markerz = null;
var circle = null;
var updatedLat;
var updatedLng;
var destLat;
var destLng;

var watchID = navigator.geolocation.watchPosition(showPosition, onError, options);

navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

// Reloads map and creates user location marker
function showLocation(){
    location.reload();
}

// Inits map and creates user location marker
function onSuccess(position) {
    
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    updatedLat = lat;
    updatedLng = lng;
    
    //Google Maps
    var myLatlng = new google.maps.LatLng(lat,lng);
    
    
    var mapOptions = {zoom: 16,center: myLatlng, zoomControl: false, mapTypeControl: false, streetViewControl: false}
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    // variables for direction services
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsDisplay.setMap(map);

    marker = new google.maps.Marker({
        position: myLatlng,
        icon: 'https://image.ibb.co/j8F82F/user_icon.png',
        title: 'Current Position',
        map: map
    });
    
    $.getJSON('https://script.google.com/macros/s/AKfycbygukdW3tt8sCPcFDlkMnMuNu9bH5fpt7bKV50p2bM/exec?id=10x8hgJEz1cy5vfrr_4-Q1FkKYopa825TCQR6IcgKP30&sheet=Sheet',
    function (data) {
    var results = data.Sheet;
        for (var i = 0; i < results.length; i++) {
            var lat1 = results[i].latitude;
            var lon1 = results[i].longitude;
            var latLng = new google.maps.LatLng(lat1,lon1);
            var name = results[i].name;
            var info = results[i].info;
            var img = results[i].img;
			var baby1 = results[i].baby;
			var male1 = results[i].male;
			var female1 = results[i].female;
			var disabled1 = results[i].disabled;
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
                '<div class="iw-subTitle">'+ info + '<img src='+ img +'>' + '<br><a href="'+ directions +'" target="_blank">Open in Google Maps</a>' + '</div>' + '</div>' + '</div>';

                google.maps.event.addListener(marker, 'click', function(){ 
                    calculateAndDisplayRoute(directionsService, directionsDisplay, myLatlng, marker.position);
                    infowindow.close();
                    // Updates the content of the infowindow before opening it
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
		    destLat = this.position.lat();
                    destLng = this.position.lng();
                }); 
            }(markers[i],i));
        }
    });
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
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

// Tracks user location and places new marker
function showPosition(position){
    updatedLat = position.coords.latitude;
    updatedLng = position.coords.longitude;
    var myUpdatedlatlng = new google.maps.LatLng(updatedLat, updatedLng);
    if (marker == null){
        marker = new google.maps.Marker({
            icon: 'https://image.ibb.co/j8F82F/user_icon.png',
            map: map
        });
        marker.setMap(map);
    }else{
        marker.setPosition(myUpdatedlatlng);
    }

    if (circle == null){
        circle = new google.maps.Circle({
            center: myUpdatedlatlng,
            radius: position.coords.accuracy,
            map: map,
            fillColor: '#0000FF',
            fillOpacity: 0.2,
            strokeColor: '#0000FF',
            strokeOpacity: 0.3
        });
        circle.setMap(map);
    }else{
        circle.setCenter(myUpdatedlatlng);
    }
}

function destMarker(){
    var destLatlng = new google.maps.LatLng(destLat, destLng);
    if (markerz == null){
        markerz = new google.maps.Marker({
            icon: 'https://image.ibb.co/iR3Vzv/toilet_map.png',
            map: map
        });
        markerz.setMap(map);
    }else{
        markerz.setPosition(destLatlng);
    }
}

var checkbox = document.querySelector('input[type="checkbox"]');

checkbox.addEventListener('change', function () {
   if (checkbox.checked) {
       for(i=0; i<markers.length; i++){
           markers[i].setMap(null);
	   destMarker();
       }
       infowindow.open(map, markerz);
       google.maps.event.addListener(markerz, 'click', function(){ 
            infowindow.close();
            infowindow.open(map, markerz);
       });
   } else {
       for(i=0; i<markers.length; i++){
           markers[i].setMap(map);
       }
   }
  });

function onError(error) {
    alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}   

//google.maps.event.addDomListener(window, 'load', position);

var script_url = "https://script.google.com/macros/s/AKfycbxmxWhOqjwU8Vwpqu6jWC3658Z0EyBZzA8OhoAve1tf2s-K14c/exec";
  
// Make an AJAX call to Google Script
function insert_value() {
	
	var male;
	var female;
	var baby;
	var disabled;
	
	var longitude=	updatedLng;
	var latitude= updatedLat;
	var name= document.getElementById("toiletName").value;
	
	// male checkbox
	if(document.getElementById("male").checked == true){
		male = "yes";	
	}
	else {
		male = "no";
	}
	
	// female checkbox
	if(document.getElementById("female").checked == true){
		female = "yes";
	}
	else {
		female = "no";
	}
	
	// baby facility checkbox
	if(document.getElementById("baby").checked == true){
		baby = "yes";	
	}
	else {
		baby = "no";
	}
	
	// disability access checkbox
	if(document.getElementById("disabled").checked == true){
		disabled = "yes";
	}
	else {
		disabled = "no";
	}
	
    var url = script_url+"?callback=ctrlq&name="+name+"&longitude="+longitude+"&female="+female+"&male="+male+"&baby="+baby+"&disabled="+disabled+"&latitude="+latitude+"&action=insert";
  
    var request = jQuery.ajax({
      crossDomain: true,
      url: url ,
      method: "GET",
      dataType: "jsonp"
    });	
  }

   function ctrlq(e) {
	alert('success');
  }

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.styleLightContent();
}


  function filter() {
	
	var male1;
	var female1;
	var baby1;
	var disabled1;

	for(i=0; i<markers.length; i++){
		marker = markers[i];
	}
	
	if(document.getElementById("male1").checked == true){
		for(i=0; i<markers.length; i++){
			if(markers[i].male1 == "yes"){
				markers[i].setVisible(true);
			} else {
				markers[i].setVisible(false);
			}
		}
	}
	
	if(document.getElementById("female1").checked == true){
		for(i=0; i<markers.length; i++){
			if(markers[i].female1 == "yes"){
				markers[i].setVisible(true);
			} else {
				markers[i].setVisible(false);
			}
		}
	}
	
	if(document.getElementById("baby1").checked == true){
		for(i=0; i<markers.length; i++){
			if(markers[i].baby1 == "yes"){
				markers[i].setVisible(true);
			} else {
				markers[i].setVisible(false);
			}
		}
	}
	
	if(document.getElementById("disabled1").checked == true){
		for(i=0; i<markers.length; i++){
			if(markers[i].disabled1 == "yes"){
				markers[i].setVisible(true);
			} else {
				markers[i].setVisible(false);
			}
		}
	}
	
	if((document.getElementById("disabled1").checked == true) && (document.getElementById("baby1").checked == true) && (document.getElementById("female1").checked == true)&& (document.getElementById("male1").checked == true)){
		for(i=0; i<markers.length; i++){
			markers[i].setVisible(true);
		}
	}

	if((document.getElementById("disabled1").checked == false) && (document.getElementById("baby1").checked == false) && (document.getElementById("female1").checked == false)&& (document.getElementById("male1").checked == false)){
		for(i=0; i<markers.length; i++){
			markers[i].setVisible(true);
		}
	}
	
}	
  
  
  

