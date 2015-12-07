## NoPa Explorer - http://jsandlund.github.io/udacity-fend-p5
Explore 5 great spots in the "North of the Panhandle" neighborhood of San Francisco, also known as NoPa :-).

This is Project 5 for Udacity's Front-End Web Developer Nanodegree. Objectives of this project:

- Create a single-page appliation featuring a map of my neighborhood, highlighting different locations
- Use a third-party MVVM framework (Knockout.js) to manage the data and codebase
- Interact with multiple online public APIs to retrieve data asynchronously using AJAX

We get ratings data from Foursquare & Yelp. Native JS Promises are used to handle multiple asynchronous requests. I attempted to use object oriented practices to make the codebase highly modular & readable.

## Screenshots

#### Desktop
![Desktop image]
(https://www.evernote.com/shard/s154/sh/1258cd6e-1a20-4287-b1c1-e0d79672cb65/46e963f34929d784/res/fdddb960-d910-494a-bd66-8bee0f4f3a1c/skitch.png)

#### Mobile
![Mobile image]
(https://www.evernote.com/shard/s154/sh/6f77a35a-3206-41c3-97f4-7213cd28527c/395d527b37024a64/res/de8b78b5-5aeb-4445-bdb6-f82371396765/skitch.png)


## Installation

1. Download the repo.
2. Open index.html in any browser

## Tools / Resources Used

- JS
  - knockoutJS ~3.4.0
  - jquery ~2.1.4
  - oath-signature ~1.3.1
  - underscore ~1.8.3
- CSS
  - Boostrap ~3.3.5
  - Boostrap Admin Template
- APIs
  - Google Maps 3.0
    - Create map / Create markers for each Location / Create infowindows for each marker
  - Foursquare 1.0
    - Get Location's foursquare data / store in local model so that's it's globally accessible
  - Yelp 2.0
    - Get Location's Yelp data / store in local model so that's it's globally accessible

# Kudos

- [BenC for his approach to assigning infowindow objects to properties of marker objects](http://stackoverflow.com/questions/5868903/marker-content-infowindow-google-maps)
- [Janfoeh for helping with toggling the visibility of marker objects in real time](http://stackoverflow.com/questions/29557938/removing-map-pin-with-search)
