var ViewModel = function() {

  var self = this;
  var map = controller.map.get();
  var initLocations = initData.locations;

  self.currentPin = ko.observable();

  // map array of locations from initData to an observableArray of Location objects
  self.locations = ko.observableArray(initLocations.map(function (location) {
    return new Location(location.name, location.latLng, location.foursquare.venue_id);
	}));


  // wire up subscriptions to location observable
  ko.utils.arrayForEach(self.locations(), function(location, i) {

    // subscribe Location to changes of Location.marker.isVisible property
    // on change of Location.isVisible
      // set visiblity of marker
      // if not visible, destory any open infowindows
    location.isVisible.subscribe(function(newState){
      location.marker.setVisible(newState);
      controller.location.closeInfowindow(location);
    })

  })


  // Observe search input
  self.searchQuery = ko.observable('');

  self.filterPins = ko.computed(function () {
    var search  = self.searchQuery().toLowerCase();

    return ko.utils.arrayFilter(self.locations(), function (location) {
        var doesMatch = location.name().toLowerCase().indexOf(search) >= 0;
        location.isVisible(doesMatch);
        return doesMatch;
    });

  });
}

$(document).ready(function() {

  window.app = {
    viewModel: new ViewModel()
  }

  ko.applyBindings(app.viewModel);

  // Okay to pass Location instances in here?
  controller.api.initRequests(window.app.viewModel.locations());

})


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
