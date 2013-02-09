var locations;
var geocoder;
var points;
var mapholder;
var map;

//Call this function to make a map.
//"container" should be a div
function makeMap(container) {
    //locations = ["NEW YORK 10027", "Austin", "Atlanta", "Baltimore"]; //list of cities or whatever

    points = [];
    geocoder = new google.maps.Geocoder();
    mapholder = container;
    doTheRest();
}

//Passing a new locationList clears the last one.
function setLocations(locationList) {
    points = [];
    codelocs(locationList.length, locationList);
}

function codelocs(n, locations) {
    var locEl = locations[n];
    if (!locations || !locEl || !locEl.location || locEl.location.length <= 0) {
        if (n > 0)
            return codelocs(n-1, locations);
        else{
            return doTheRest();
        }
    }
        
    geocoder.geocode( {'address' : locations[n].location}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            points.push(results[0].geometry.location);
            if (n > 0)
                codelocs(n-1, locations);
            else
                doTheRest();
        } else {
            alert(n + " " + status);
            doTheRest();
        }
    });
}

function doTheRest() {

    var poly;

    if(!map) map = new google.maps.Map(mapholder, {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(39.87, -98.5),
        zoom: 4
    });

    if (points.length <= 0)
        return;

    poly = new google.maps.Polyline({
        strokeColor: '#ff3333',
        strokeWeight: 2,
        strokeOpacity: 1.0
    });
    poly.setMap(map);

    var path = poly.getPath();

    for(var i=0; i<points.length; i++) {
        path.push(points[i]);
    }

    map.setCenter(points[0]);
    var marker = new google.maps.Marker({
        position: points[0],
        map: map,
        title: "Your package was here last."
    });
}
