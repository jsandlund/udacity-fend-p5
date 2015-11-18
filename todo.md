# Pre-Load
  - Build array of locations
    - Convert string addresses to LatLong pairs - Read docs on geocoding addresses to latLong https://developers.google.com/maps/documentation/geocoding/intro
  - Get data from 3rd party APIs, Yelp & Foursquae 

# On load
  - Build map, with 5 locations
  - Build sidebar

# On search
  - Filter locations

# On click
  - Trigger modal
  - Show location with meta data from Yelp & Foursquare
    - See docs on info windows: https://developers.google.com/maps/documentation/javascript/signedin
