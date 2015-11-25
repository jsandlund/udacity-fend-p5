function Location (name, latLng, foursquare_venue_id, yelp_business_id) {
  var self = this;

  // Observables
  self.name = ko.observable(name);
  self.isVisible = ko.observable(true);
  self.isSelected = ko.observable(false);

  // Non-Observables
  self.latLng = latLng;
  self.data = {
    yelp: {
        businessId: yelp_business_id
    },
    foursquare: {
      venue_id: foursquare_venue_id
    }
  }

  // Create marker and wire up click listener
  self.marker = controller.location.createMarker(self.latLng, self.name());
  self.marker.addListener("click", function(){
    controller.location.handleMarkerClick(self, this);
  })

  // Create infowindow; set infowindow to marker
  self.marker.infowindow = controller.location.createInfowindow();

};


var model = {

  state: {
    prev_infowindow: false
  },

  map: controller.map.create(initData.map.mapStartLatLng, initData.map.zoom),

  API: {

    YELP: {
      AUTH_PUBLIC: {
        oauth_consumer_key : 'WjN69d5DhJDQOOEgPfb3oQ',
        oauth_token : 'eAqQ1_X4GERAPMhHnoZFKrfxBkXrkidG',
        oauth_signature_method : 'HMAC-SHA1'
      },
      AUTH_SECRET: {
        consumer_secret: 'T96VnXNd984UnwZUMljKPw93Y7I',
        token_secret: 'EotHsoy5UPorAks8Mlw-UTLJjAw'
      },
      CONTEXT: {
        BASE_URL: 'https://api.yelp.com/v2/business/'
      }
    },

    FOURSQUARE: {
      AUTH_SECRET: {
        CLIENT_SECRET: 'ELYTAJTSDKP3T1UTA22LMFBAUTPE2BPTBSGKE2CNL1HOWF1K'
      },
      AUTH_PUBLIC: {
        CLIENT_ID: '2UDRFTT4KL1F42GTXEJ4DJCNUJMC3O5ZTUYJNQ4LVH4EMPLK'
      },
      CONTEXT: {
        BASE_URL: 'https://api.foursquare.com/v2/venues/',
        NEAR: 'San Francisco, CA'
      }
    }
  }

}
