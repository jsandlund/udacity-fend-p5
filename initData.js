"use strict";

// This is seed data for the application
// It is static and does not change.
// All properties are required for the app to function as-intended

var initData = {
  locations: [
    {
      name: "Matching Half Cafe",
      latLng: {lat: 37.777094, lng: -122.441613},
      yelp: {
        id: "matching-half-cafe-san-francisco-3"
      },
      foursquare: {
        venue_id: '4aea176df964a52047b921e3'
      }
    },
    {
      name: "Mojo Bicycle Cafe",
      latLng: {lat: 37.775549, lng: -122.438124},
      yelp: {
        id: "mojo-bicycle-cafe-san-francisco-2"
      },
      foursquare: {
        venue_id: '49c29489f964a52004561fe3'
      }
    },
    {
      name: "The Mill",
      latLng: {lat: 37.776465, lng: -122.437789},
      yelp: {
        id: "the-mill-san-francisco"
      },
      foursquare: {
        venue_id: '4feddd79d86cd6f22dc171a9'
      }
    },
    {
      name: "Flywheel Coffee Roasters",
      latLng: {lat: 37.769726, lng: -122.453318},
      yelp: {
        id: "flywheel-coffee-roasters-san-francisco"
      },
      foursquare: {
        venue_id: '4f934157e4b0ab5f09ebb8fc',
      }
    },
    {
      name: "Madrone Art Bar",
      latLng: {lat: 37.774234, lng: -122.437312},
      yelp: {
        id: "madrone-art-bar-san-francisco"
      },
      foursquare: {
        venue_id: '43598100f964a520f7281fe3',
      }
    }
  ],
  map: {
    mapStartLatLng: {lat: 37.775961, lng: -122.445178},
    zoom: 15
  }
};
