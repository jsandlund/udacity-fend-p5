var controller = {

  map: {

    /**
     * Instantiates google Map object
     * @return map {object}
    **/
    create: function(startLatLng, zoom) {

      try {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          center: startLatLng,
          zoom: zoom
        });
      }
      catch(err){
        controller.helpers.handleError("Google maps is not loading. This may be due to not having an internet connection.");
      }

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

    handleMarkerClick: function(Location, marker) {

      if (model.state.prev_infowindow) {
        model.state.prev_infowindow.close();
      }

      // Animate marker
      controller.location.animateMarker(marker);

      // Toggle Selected
      controller.location.toggleSelected(Location)

      // Open infowindow
      marker['infowindow'].open(controller.map.get(), marker);

      model.state.prev_infowindow = marker['infowindow'];
    },

    closeInfowindow: function(Location) {
      return Location.marker.infowindow.close();
    },

    animateMarker: function(marker) {
      // start bounce
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // stop bounce after x MS
      window.setTimeout(function(){ marker.setAnimation(null) }, 1400)
    },

    createInfowindow: function() {
      var infowindow = new google.maps.InfoWindow({
        content: '<p> Loading... </p>'
      });
      return infowindow;
    },

    updateInfowindow: function(Location) {
      var infowindow = Location.marker.infowindow,
          fsq = Location.data.foursquare,
          yelp = Location.data.yelp,
          htmlString = '';
      htmlString =

      '<h1>' + fsq.name + '</h1>' +
      '<h5>' +
        '<a target="_blank" href="' + fsq.shortUrl + '">' + 'Foursquare Profile' + '</a>' + ' | ' +
        '<a target="_blank" href="' + yelp.url + '">' + 'Yelp Profile' + '</a>' + ' | ' +
        '<a target="_blank" href="' + fsq.url + '">' + 'Website' + '</a>'  +
      '</h5>' +
      '<p>' + fsq.location.address + ', ' + fsq.location.city + ' ' + fsq.location.state + '</p>' +
      '<p>' + fsq.contact.formattedPhone + '</p>' +
      '<hr>' +
      '<ul>' +
        '<li>' + 'Ratings ' +
          '<ul>' +
            '<li> Foursquare: ' + fsq.rating + ' / 10' + '</li>' +
            '<li> Yelp: ' + yelp.rating + ' / 5' + '</li>' +
          '</ul>' +
        '</li>' +
        '<li>' + 'Review Counts ' +
          '<ul>' +
            '<li> Foursquare '+ fsq.ratingSignals + '</li>' +
            '<li> Yelp: '+ yelp.review_count  + '</li>' +
          '</ul>' +
        '</li>' +
      '</ul>'

      // Update infowindow with new string
      infowindow.content = htmlString;
    },

    toggleVisibility: function(location){
      location.isVisible(!location.isVisible());
    },

    toggleSelected: function(location){
      location.isSelected(!location.isSelected());
    }

  },

  api: {

    initRequests: function(Locations) {

      // Call 3rd Party APIs
      // Each call is wrapped in a Promise
      var getFsq = controller.api.getFsq(Locations);
      var getYelp = controller.api.getYelp(Locations);

      // When each Promise is resolved, prepare infowindow content and update all infowindows
      Promise.all([getFsq, getYelp]).then(function(results){

        Locations.forEach(function(Location){
          controller.location.updateInfowindow(Location);
        })

        console.log("Il est fini!");

      })


    },

    nonce_generate: function() {
      return (Math.floor(Math.random() * 1e12).toString());
    },

    timestamp_generate: function(){
      return Math.floor(Date.now()/1000);
    },

    getYelp: function(Locations) {

      return new Promise(function(resolve, reject) {

        var counter = Locations.length;
        var resolveYelpFn = function(){console.log("getYelp resolved!")};

        Locations.forEach(function(Location){

          var url = model.API.YELP.CONTEXT.BASE_URL + Location.data.yelp.businessId,
              consumer_secret = model.API.YELP.AUTH_SECRET.consumer_secret,
              token_secret = model.API.YELP.AUTH_SECRET.token_secret;

          var params = {
            oauth_consumer_key: model.API.YELP.AUTH_PUBLIC.oauth_consumer_key,
            oauth_token: model.API.YELP.AUTH_PUBLIC.oauth_token,
            oauth_nonce: controller.api.nonce_generate(),
            oauth_timestamp: controller.api.timestamp_generate(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version : '1.0',
            callback: 'cb'
         };

          // Generate oauthSignature / add to params object
          var encodedSignature = oauthSignature.generate('GET', url, params, consumer_secret, token_secret);
          params.oauth_signature = encodedSignature;

          // Call API
          $.ajax({
            url: url,
            cache: true,
            data: params,
            dataType: 'jsonp'
          })
          .done(function(results, status, xhr) {
            console.log("Yelp call complete!")
            // save Yelp data to Location instance
            Location.data.yelp = results;
          })
          .fail(function(m){
            handleError(m);
          })
          .always(function(xhr, status){
            counter--;
            if(counter === 0) {
              resolve(resolveYelpFn());
            }
          })

        })

      })

    },

    getFsq: function(Locations) {

      return new Promise(function(resolve, reject) {

        var counter = Locations.length;
        var resolveFn = function(){console.log("getFsq resolved!")}

        Locations.forEach(function(Location) {

          var url = model.API.FOURSQUARE.CONTEXT.BASE_URL + Location.data.foursquare.venue_id,
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
            console.log("Foursquare call complete!");
            // Append foursquare data to Location instance
            var fsq = result.response.venue;
            Location.data.foursquare = fsq;

          })
          .fail(function(m){
            handleError(m);
          })
          .always(function(xhr, status){
            // deincrement counter
            // when counter reaches 0, resolve Promise
            counter--;
            if(counter === 0) {
              resolve(resolveFn());
            }
          })
        })

      })
    }
  }, // end api

  helpers: {

    handleError: function(msg){

      return alert(msg);

    }
  }

}
