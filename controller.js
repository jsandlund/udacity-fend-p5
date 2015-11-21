var controller = {

  locations: {
    getLocations: function(){
      return model.locations;
    }
  },


  map: {

    /**
     * Instantiates google Map object
     * @return map {object}
    **/
    init: function() {

      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: model.map.mapStartLatLng,
        zoom: model.map.zoom
      });

      // Set map height to the window height
      $("#map-canvas").css("height", window.innerHeight)

      return map;
    }

  },

  api: {

    /**
     * Generates a random number and returns it as a string for OAuthentication
     * @return {string}
    **/
    nonce_generate: function() {
      return (Math.floor(Math.random() * 1e12).toString());
    },

    getFoursquareData: function(Pin){

      var url = model.API.FOURSQUARE.CONTEXT.BASE_URL + Pin.foursquareVenueId,
          params = {
            client_id: model.API.FOURSQUARE.AUTH_PUBLIC.CLIENT_ID,
            client_secret: model.API.FOURSQUARE.AUTH_SECRET.CLIENT_SECRET,
            v: new Date().toISOString().slice(0,10).replace(/-/g, "")
          };

      $.ajax({
        url: url,
        data: params
      })
      .done(function(results) {
        var venue = results.response.venue;
      })
      .fail(function(m){
        console.log("ERROR!", m);
      });
    }
  }
}
