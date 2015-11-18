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
      BASE_URL: "https://api.yelp.com/v2/business/"
    }
  }

}
// // var yelp_url = YELP_BASE_URL + 'business/' + self.selected_place().Yelp.business_id;
// // notice how this uses self an observable value.
