var locations;
var geocoder;
var points;
var mapholder;
var map;
var activeMarkers;
var poly;
var infoWindow; 

//Call this function to make a map.
//"container" should be a div
function makeMap(container) {
    //locations = ["NEW YORK 10027", "Austin", "Atlanta", "Baltimore"]; //list of cities or whatever
    points = [];
    activeMarkers = [];
    geocoder = new google.maps.Geocoder();
    mapholder = container;
    infoWindow = new google.maps.InfoWindow({maxWidth: 50});
    doTheRest();
}

//Passing a new locationList clears the last one.
function setLocations(locationList) {
    points = [];
    locations = locationList;
    codelocs(0);
}

function codelocs(n) {
    var locEl = locations[n];
    if (!locations || !locEl || !locEl.location || locEl.location.length <= 0) {
        if (n < locations.length)
            return codelocs(n+1, locations);
        else{
            return doTheRest();
        }
    }

    //location container object
    var location = locations[n].location;
    //valid address format
    var address = "";
    if (location.city || location.zip)
        address = location.address + " " + location.city + ", " + location.state + " " + location.zip + " " + location.country;

    geocoder.geocode( {'address' : address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            points.push(results[0].geometry.location);
            if (n < locations.length)
                codelocs(n+1, locations);
            else
                doTheRest();
        } else {
            if (n < locations.length)
                codelocs(n+1, locations);
            else
                doTheRest();
        }
    });
}

function doTheRest() {

    if(!map || map.getDiv() != mapholder)
    {   
        map = new google.maps.Map(mapholder, {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(39.87, -98.5),
            zoom: 4
        });

        google.maps.event.addListener(map, 'click', function() {
            infoWindow.open() 
        });
    }

    if (points.length <= 0)
        return;

    var color = get_random_color();

    poly = new google.maps.Polyline({
        strokeColor: color,
        strokeWeight: 2,
        strokeOpacity: 1.0
    });
    poly.setMap(map);

    var path = poly.getPath();

    for(var i=0; i<points.length; i++) {
        //Connect Points
        path.push(points[i]);

        //Create Custom Icon
        //var newIcon = MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: color, cornercolor: color});

        //Make Markers
        var latLang = points[i];

        var marker = new google.maps.Marker({
            position: latLang,
            map: map,
            title: locations[i] ? locations[i].status : ""
        });
        if(marker) activeMarkers.push(marker);
    }
    
    for( var i in activeMarkers)
    {
        google.maps.event.addListener(activeMarkers[i], 'click', function() {
            // Create content  
            var contentString = "<div><h5>" + this.title + "</h5>" + "<p>Location: " + this.getPosition() + "</p></div>"; 

            // Replace our Info Window's content and position 
            infoWindow.setContent(contentString); 
            infoWindow.setPosition(this.getPosition()); 
            infoWindow.open(map) 
        });
    }

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(activeMarkers[0].position);
    bounds.extend(activeMarkers[activeMarkers.length - 1].position);
    map.fitBounds(bounds);
}

function deleteOverlays() {
    if (activeMarkers) {
        for (i in activeMarkers) {
            activeMarkers[i].setMap(null);
        }
        activeMarkers.length = 0;
    }
    
    if (poly) poly.setMap(null);
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
