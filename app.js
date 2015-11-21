var ViewModel = function() {

  var self = this;
  var map = controller.map.init();
  var locations = controller.locations.getLocations();

  // instantiate pins array
  self.pins = ko.observableArray();
  self.currentPin = ko.observable();

  // build pins array
  locations.forEach(function(location, i) {
    self.pins.push(new Pin(map, location));
  })

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
var Pin = function (map, location) {

  var self = this;

  // Observables
  this.name = ko.observable(location.name);
  this.isVisible = ko.observable(false);
  this.isSelected = ko.observable(false);

  // Properties
  this.latLng = location.latLng;
  this.foursquareVenueId = location.foursquare.venue_id;

  // create marker
  var marker = new google.maps.Marker({
    position: this.latLng,
    title: this.name()
  });

  var infowindowHTML = "<p>" + this.name() + "</p>";

  // Set infowindow obj to be a property marker object
  marker['infowindow'] = new google.maps.InfoWindow({
    content: infowindowHTML
  })

  // Listen to click events on marker
  marker.addListener("click", function(){

    if (prev_infowindow) {
      prev_infowindow.close();
    }

    // Trigger Foursquare API call for clickedLocation
    controller.api.getFoursquareData(self);

    // Animate marker
    animateMarker(this);

    // Open infowindow
    this['infowindow'].open(map, this);

    prev_infowindow = this['infowindow'];
  })

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
    if(currentState){
      marker['infowindow'].open(map, marker);
    }
    prev_infowindow = marker['infowindow'];
  })

  // make marker visible by default
  this.isVisible(true);

}

// Toggle visible flag on Pin
Pin.prototype.toggleVisibility = function(){
  this.isVisible(!this.isVisible());
}

// Toggle selected flag on Pin
Pin.prototype.toggleSelected = function(){
  this.isSelected(!this.isSelected());
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



ko.applyBindings(new ViewModel());





// function getYelpData(yelpBusinessId){
//
//    var url = API.YELP.CONTEXT.BASE_URL + yelpBusinessId;
//    var params = API.YELP.AUTH_PUBLIC;
//    var consumer_secret = API.YELP.AUTH_SECRET.consumer_secret;
//    var token_secret = API.YELP.AUTH_SECRET.token_secret;
//    var oauth_options = { encodeSignature: false };
//
//   // Add run time oauth properties to params object
//   params.oauth_nonce = controller.nonce_generate();
//   params.oauth_timestamp = Math.floor(Date.now()/1000);
//   params.callback = 'cb'
//
//   // Generate oauthSignature / add to params object
//   var signature = oauthSignature.generate('GET', url, params, consumer_secret, token_secret, oauth_options);
//
//   // Add signature to params objects
//   params.oauth_signature = signature;
//
//   // Call API
//   $.ajax({
//     url: url,
//     data: params,
//     cache: true,
//     dataType: 'jsonp',
//   }).done(function(results) {
//     console.log(results);
//     console.log("url", this.url);
//   }).fail(function(m){
//     console.log("ERROR!", m)
//   })
//
// };
