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

  map: {
    mapStartLatLng: {lat: 37.775961, lng: -122.445178},
    zoom: 15
  },

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
