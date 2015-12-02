var ViewModel = function() {

  var self = this;
  var map = controller.map.get();
  var initLocations = initData.locations;

  self.currentPin = ko.observable();

  // map array of locations from initData to an observableArray of Location objects
  self.locations = ko.observableArray(initLocations.map(function (location) {
    return new Location(location.name, location.latLng, location.foursquare.venue_id, location.yelp.id);
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

  controller.api.initRequests(window.app.viewModel.locations());

})
