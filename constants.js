/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
**/

function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var API = {

  YELP: {
    AUTH_PUBLIC: {
      oauth_consumer_key : 'WjN69d5DhJDQOOEgPfb3oQ',
      oauth_token : 'eAqQ1_X4GERAPMhHnoZFKrfxBkXrkidG',
      oauth_signature_method : 'HMAC-SHA1',
      callback: 'cb'
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

// Foursquare
// Some of our endpoints that don’t pertain to specific user information, such as venues search are enabled for userless access (meaning you don’t need to have a user auth your app for access). To make a userless request, specify your consumer key's Client ID and Secret instead of an auth token in the request URL.
// https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&v=YYYYMMDD
