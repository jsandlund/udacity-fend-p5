var model = {
  buildMap: function(){
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: model.mapStartLatLng,
      zoom: 15
    });
    // Dynamically set height of map to the window height
    $("#map-canvas").css("height", window.innerHeight)

    return map;
  },
  mapStartLatLng: {lat: 37.775961, lng: -122.445178},

  locations: [
    {
      name: "Matching Half Cafe",
      category: "Coffee",
      address: "1799 McAllister St, San Francisco, CA 94117",
      latLng: {lat: 37.777094, lng: -122.441613},
      yelp: {
        id: "matching-half-café-san-francisco-3"
      }
    },
    {
      name: "Flywheel Coffee Roasters",
      category: "Coffee",
      address: "672 Stanyan St, San Francisco, CA 94117",
      latLng: {lat: 37.769726, lng: -122.453318},
      yelp: {
        id: "flywheel-coffee-roasters-san-francisco"
      }
    },
    {
      name: "Madrone Art Bar",
      category: "Bar",
      address: "500 Divisadero St, San Francisco, CA 94117",
      latLng: {lat: 37.774234, lng: -122.437312},
      yelp: {
        id: "madrone-art-bar-san-francisco"
      }
    }
  ]

}

var ViewModel = function(map, locations){
  var self = this;

  // instantiate pins array
  self.pins = ko.observableArray();
  self.currentPin = ko.observable();

  // build pins array to hold all single pins
  locations.forEach(function(location, i) {
    self.pins.push(new Pin(map, location.name, location.latLng, location.name));
  })

  self.setCurrentPin = function(pinIndex) {
    console.log(name);
    // self.currentPin(self.pins[name]);
  }

  // Observe search input
  self.searchQuery = ko.observable('');

  self.filterPins = ko.computed(function () {
    var search  = self.searchQuery().toLowerCase();

    return ko.utils.arrayFilter(self.pins(), function (pin) {
        var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
        pin.isVisible(doesMatch);
        return doesMatch;
    });

  });

}

var prev_infowindow = false;

// Pin constructor function
var Pin = function (map, name, latLng) {
  var marker;

  this.name = ko.observable(name);
  this.latLng = latLng;
  this.isVisible = ko.observable(false);
  this.isSelected = ko.observable(false);

  // flag to determine if markers are hidden or shown
  this.toggleVisibility = function(){
    this.isVisible(!this.isVisible());
  }

  // create marker
  marker = new google.maps.Marker({
    position: latLng,
    title: name
  });

  // Listen to changes on isVisible property. On change, evaluate if marker should visible or not
  this.isVisible.subscribe(function(currentState){
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  // Listen to changes of isSelected property; on change open infowindow
  this.isSelected.subscribe(function(currentState){
    console.log("prev_infowindow", prev_infowindow)
    console.log("currentState", currentState);
    if (prev_infowindow) {
      prev_infowindow.close();
    }
    if(currentState){
      marker['infowindow'].open(map, marker);
    }
    prev_infowindow = marker['infowindow'];
  })

  // make marker visible by default
  this.isVisible(true);

  // Attach infowindow property to marker object
  marker['infowindow'] = new google.maps.InfoWindow({
    content: document.getElementById("infobox1")
  });

  // On click of marker
    // Check if an infowindow is already open; if so, close it.
    // Open infowindow property, which is binded to the marker object
  marker.addListener("click", function(){
    if (prev_infowindow) {
      prev_infowindow.close();
    }

    // Get clicked location object from model
    var clickedLocationObj = getLocationByName(this.title);
    // Trigger Yelp API call for clickedLocation
    getYelpData(clickedLocationObj.yelp.id);

    // Animate marker
    animateMarker(this);

    // Open infowindow
    this['infowindow'].open(map, this);

    prev_infowindow = this['infowindow'];
  })

}

// Helper functions
function animateMarker(marker){
  // start bounce
  marker.setAnimation(google.maps.Animation.BOUNCE);
  // stop bounce after x MS
  window.setTimeout(function(){ marker.setAnimation(null) }, 1400)
}

// Returns a locations object when provided its name
function getLocationByName(locationName) {

  var locations = model.locations.filter( function(obj) {
    return obj.name === locationName;
  });
  // return only first results
  return locations[0];
}

function getYelpData(yelpBusinessId){

  var url = API.YELP.CONTEXT.BASE_URL + yelpBusinessId,
      params = API.YELP.AUTH_PUBLIC,
      consumer_secret = API.YELP.AUTH_SECRET.consumer_secret,
      token_secret = API.YELP.AUTH_SECRET.token_secret,
      oauth_nonce = nonce_generate(),
      oauth_timestamp = Math.floor(Date.now()/1000),
      oauth_options = { encodeSignature: false };

  // Add run time oauth properties to params object
  params.oauth_nonce = oauth_nonce;
  params.oauth_timestamp = oauth_timestamp;

  // Generate oauthSignature / add to params object
  var signature = oauthSignature.generate('GET', url, params, consumer_secret, token_secret, oauth_options);

  // Add signature to params objects
  params.oauth_signature = signature;

  // Call API
  $.ajax({
    url: url,
    data: params,
    cache: true,
    dataType: 'jsonp',
    success: function(results) {
      console.log("yelp results", results);
    },
    error: function() {
      console.log("ERROR!")
    }
  })

};

ko.applyBindings(new ViewModel(model.buildMap(), model.locations));
