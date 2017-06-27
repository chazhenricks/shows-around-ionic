"use strict";

app.factory("LocationFactory", function($timeout, $q, $http) {

    // sets empty variables to store location info
    var coords = {};
    var currentCity = "";

    // uses javascript location methods to get coordinates of users current location
    // *NOTE* can only be used on localhost or site with https. If hosted on site only using http this will not fucntion
    let getCoords = function() {
        if (navigator.geolocation) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(function(position) {
                    coords.lat = position.coords.latitude;
                    coords.long = position.coords.longitude;
                    resolve(coords);
                });
            });
        }

    };

    // sets current city to city that user has input
    let newCity = function(city) {
        currentCity = city;
    };

    // runs the lat/long coordinates into the google maps api and filters out city name
    let getCityByCoords = function(lat, long) {
        return $q((resolve, reject) => {
            $http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true`)
                .then((response) => {
                    currentCity = (response.data.results[0].address_components[3].long_name);
                    console.log("current city", currentCity);
                    resolve(currentCity);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // returns current city
    let getCurrentCity = () => {
        return currentCity;
    };


    return { getCoords, getCityByCoords, getCurrentCity, newCity };

});
