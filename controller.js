var controller = {

  map: {

    /**
     * Instantiates google Map object
     * @return map {object}
    **/
    create: function(startLatLng, zoom) {

      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: startLatLng,
        zoom: zoom
      });

      // Set map height to the window height
      $("#map-canvas").css("height", window.innerHeight)

      return map;
    },

    get: function(){
      return model.map;
    }
  },

  location: {

    createMarker: function(latLng, name){

      var newMarker  = new google.maps.Marker({
        position: latLng,
        title: name,
        map: controller.map.get()
      });

      return newMarker;
    },

    handleMarkerClick: function(location, marker) {

      if (model.state.prev_infowindow) {
        model.state.prev_infowindow.close();
      }

      // Animate marker
      controller.location.animateMarker(marker);

      // Toggle Selected
      controller.location.toggleSelected(location)

      // Open infowindow
      marker['infowindow'].open(controller.map.get(), marker);

      model.state.prev_infowindow = marker['infowindow'];
    },

    closeInfowindow: function(location) {
      return location.marker.infowindow.close();
    },

    animateMarker: function(marker){
      // start bounce
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // stop bounce after x MS
      window.setTimeout(function(){ marker.setAnimation(null) }, 1400)
    },

    createInfowindow: function(){
      var infowindow = new google.maps.InfoWindow({
        content: '<p> Loading... </p>'
      });
      return infowindow;
    },

    updateInfowindow: function(infowindow, htmlString){
      infowindow.content = htmlString
    },

    toggleVisibility: function(location){
      location.isVisible(!location.isVisible());
    },

    toggleSelected: function(location){
      location.isSelected(!location.isSelected());
    }

  },

  api: {

    /**
     * Generates a random number and returns it as a string for OAuthentication
     * @return {string}
    **/

    initRequests: function(Locations) {

      Locations.forEach(function(Location){
        controller.api.getAndHandleFoursquareData(Location);
      })

    },

    nonce_generate: function() {
      return (Math.floor(Math.random() * 1e12).toString());
    },

    getAndHandleFoursquareData: function(Location) {

      var url = model.API.FOURSQUARE.CONTEXT.BASE_URL + Location.foursquareData.venue_id,
          params = {
            client_id: model.API.FOURSQUARE.AUTH_PUBLIC.CLIENT_ID,
            client_secret: model.API.FOURSQUARE.AUTH_SECRET.CLIENT_SECRET,
            v: new Date().toISOString().slice(0,10).replace(/-/g, "")
          };

      $.ajax({
        url: url,
        data: params
      })
      .done(function(result) {

        // Append foursquare data to Location instance
        var fsq = result.response.venue;
        Location.foursquareData = fsq;

        // Build new infowindow HTML string; update Location's infowindow content
        var infowindowHtml =
          '<h1>' + fsq.name + '</h1>' +
          '<h5>' +
            '<a target="_blank" href="' + fsq.shortUrl + '">' + 'Foursquare Profile' + '</a>' + ' | ' +
            '<a target="_blank" href="' + fsq.url + '">' + 'Website' + '</a>' +
          '</h5>' +
          '<hr>' +
          '<ul>' +
            '<li>' + 'Rating: ' + fsq.rating + '</li>' +
            '<li>' + 'Address: ' + fsq.location.address + '</li>' +
            '<li>' + 'Total Checkins: ' + fsq.stats.checkinsCount + '</li>' +
          '</ul>'

        Location.marker.infowindow.content = infowindowHtml;

      })
      .fail(function(m){
        console.log("ERROR!", m);
      });
    }
  }
}
