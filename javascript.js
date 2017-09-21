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
var gmarkers = []
var filters = {male:false, female:false, baby_facil:false, wheelchair:false}
var watchID = navigator.geolocation.watchPosition(showPosition, onError, options);

navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });



$(function () {
    $('input[name=filter]').change(function (e) {
     map_filter(this.id);
      filter_markers()
  });


})

var get_set_options = function() {
  ret_array = []
  for (option in filters) {
    if (filters[option]) {
      ret_array.push(option)
    }
  }
  return ret_array;
}

var filter_markers = function() {  
  set_filters = get_set_options()
  for (i = 0; i < markers.length; i++) {
    marker = markers[i];
    keep=true
    for (opt=0; opt<set_filters.length; opt++) {
      if (!marker.properties[set_filters[opt]]) {
        keep = false;
      }
    }
    marker.setVisible(keep)
  }
}

var map_filter = function(id_val) {
   if (filters[id_val]) 
      filters[id_val] = false
   else
      filters[id_val] = true
}


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
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    // variables for direction services
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
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
			var male = results[i].male;
			var female = results[i].female;
			var baby_facil = results[i].baby_facil;
			var wheelchair = results[i].wheelchair;
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
                '<div class="iw-subTitle">'+ info + '<img src='+ img +'>' + '<br><a href="'+ directions +'" target="_blank">Get directions</a>' + '</div>' + '</div>' + '</div>';

                google.maps.event.addListener(marker, 'click', function(){ 
                    calculateAndDisplayRoute(directionsService, directionsDisplay, myLatlng, marker.position);
                    infowindow.close();
                    // Updates the content of the infowindow before opening it
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
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
    var updatedLat = position.coords.latitude;
    var updatedLng = position.coords.longitude;
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

}

function onError(error) {
    alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}   

//google.maps.event.addDomListener(window, 'load', position);