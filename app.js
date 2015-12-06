"use strict";

// Main ViewModel
// Handles the UI of the Sidebar && the visibility of marker objects
// It DOES NOT handle the UI of infomarkers
// It is independent of all data collection && storage
var ViewModel = function() {

  var self = this;
  var map = controller.map.get();
  var initLocations = initData.locations;

  self.currentPin = ko.observable();

  self.locations = ko.observableArray(initLocations.map(function (location) {
    return new Location(location.name, location.latLng, location.foursquare.venue_id, location.yelp.id);
	}));

  // wire up subscriptions to location observable
  ko.utils.arrayForEach(self.locations(), function(Location, i) {

    // subscribe Location to changes of Location.isVisible property
    // on change of Location.isVisible
      // set visiblity of marker
      // if not visible, destroy any open infowindows
    Location.isVisible.subscribe(function(newState){
      Location.marker.setVisible(newState);
      controller.location.closeInfowindow(Location);
    });

  });

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
};

$(document).ready(function() {

  window.app = { viewModel: new ViewModel() };

  ko.applyBindings(window.app.viewModel);

  controller.api.initRequests(window.app.viewModel.locations());

});
