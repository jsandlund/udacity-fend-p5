var model = {
  locations: [
    {
      name: "Matching Half Cafe",
      category: "Coffee",
      address: "1799 McAllister St, San Francisco, CA 94117",
      latLng: {lat: 37.777094, lng: -122.441613},
      yelp: {
        id: "matching-half-cafe-san-francisco-3"
      },
      foursquare: {
        venue_id: '4aea176df964a52047b921e3'
      }
    },
    {
      name: "Flywheel Coffee Roasters",
      category: "Coffee",
      address: "672 Stanyan St, San Francisco, CA 94117",
      latLng: {lat: 37.769726, lng: -122.453318},
      yelp: {
        id: "flywheel-coffee-roasters-san-francisco"
      },
      foursquare: {
        venue_id: '4f934157e4b0ab5f09ebb8fc'
      }
    },
    {
      name: "Madrone Art Bar",
      category: "Bar",
      address: "500 Divisadero St, San Francisco, CA 94117",
      latLng: {lat: 37.774234, lng: -122.437312},
      yelp: {
        id: "madrone-art-bar-san-francisco"
      },
      foursquare: {
        venue_id: '43598100f964a520f7281fe3'
      }
    }
  ],

  buildMap: function(){
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: model.mapStartLatLng,
      zoom: 15
    });
    // Dynamically set height of map to the window height
    $("#map-canvas").css("height", window.innerHeight)

    return map;
  },

  mapStartLatLng: {lat: 37.775961, lng: -122.445178}

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
  var self = this;
  var marker;

  this.name = ko.observable(name);
  this.nameId = this.name().replace(/\s+/g, '-').toLowerCase();
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

  this.toggleSelected = function(){
    console.log("toggle selected");
    this.isSelected(!this.isSelected());
  }

  // Listen to changes of isSelected property; on change open infowindow
  this.isSelected.subscribe(function(currentState){
    console.log("prev_infowindow", prev_infowindow)
    console.log("currentState", currentState);

    if(currentState){
      marker['infowindow'].open(map, marker);
    }
    prev_infowindow = marker['infowindow'];
  })

  // make marker visible by default
  this.isVisible(true);

  // On click of marker
    // Check if an infowindow is already open; if so, close it.
    // Open infowindow property, which is binded to the marker object
  marker.addListener("click", function(){

    if(!this['infowindow']) {
      // Attach infowindow property to marker object
      this['infowindow'] = new google.maps.InfoWindow({
        content: document.getElementById(self.nameId)
      });
    }


    if (prev_infowindow) {
      prev_infowindow.close();
    }

    // Get clicked location object from model
    var clickedLocationObj = getLocationByName(this.title);
    console.log("marker object", this)

    // Trigger Yelp API call for clickedLocation
    // var yelpData = getYelpData(clickedLocationObj.yelp.id);

    // Trigger Foursquare API call for clickedLocation
    var foursquareData = getFoursquareData(clickedLocationObj.foursquare.venue_id);

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

var businessID = "madrone-art-bar-san-francisco";

function getYelpData(yelpBusinessId){

   var url = API.YELP.CONTEXT.BASE_URL + yelpBusinessId;
   var params = API.YELP.AUTH_PUBLIC;
   var consumer_secret = API.YELP.AUTH_SECRET.consumer_secret;
   var token_secret = API.YELP.AUTH_SECRET.token_secret;
   var oauth_options = { encodeSignature: false };

  // Add run time oauth properties to params object
  params.oauth_nonce = nonce_generate();
  params.oauth_timestamp = Math.floor(Date.now()/1000);
  params.callback = 'cb'

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
  }).done(function(results) {
    console.log(results);
    console.log("url", this.url);
  }).fail(function(m){
    console.log("ERROR!", m)
  })

};

function getFoursquareData(fousquare_venue_id) {
  var url = API.FOURSQUARE.CONTEXT.BASE_URL + fousquare_venue_id,
      params = {
        client_id: API.FOURSQUARE.AUTH_PUBLIC.CLIENT_ID,
        client_secret: API.FOURSQUARE.AUTH_SECRET.CLIENT_SECRET,
        v: new Date().toISOString().slice(0,10).replace(/-/g, "")
      };

  $.ajax({
    url: url,
    data: params
  }).done(function(results) {
    var venue = results.response.venue;
    console.log(venue);
  }).fail(function(m){
    console.log("ERROR!", m)
  })
}

ko.applyBindings(new ViewModel(model.buildMap(), model.locations));
