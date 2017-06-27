"use strict";

app.controller("ShowsListCtrl", function($scope, LocationFactory, AuthFactory, DataFactory, Spotify, $location, localStorageService, $rootScope) {

    //Controlls what is available in the nav bar based on if the user has logged into spotify
    $rootScope.isSpotify = true;

    //Grabs either current location or user inout city from LocationFactory
    let city = LocationFactory.getCurrentCity();

    //Gets back the array of shows that match the specified city and parses the data into an object we can use to populate the page.
    let getArtistsShows = function(artists) {
        // $scope.localShows = [];
        DataFactory.getArtistsShows(artists)
            .then((shows) => {
                //$scope.localShows = shows;
            });
    };


    //Gets the last 50 top artists played within the last:
    // short_term: few weeks
    // medium_term: few months
    // long_term: few years

    let getTopArtists = () => {
        Spotify.getUserTopArtists({ limit: 50, time_range: "long_term" })
            .then(function(data) {
                var artists = [];
                var arrayFromSpotify = data.data.items;
                console.log(arrayFromSpotify);
                arrayFromSpotify.forEach(function(item) {
                    var artistData = {};
                    artistData.name = item.name;
                    if (item.images[0]) {
                        artistData.picture = item.images[0].url;
                    }
                    artists.push(artistData);
                });
                getArtistsShows(artists);
            });
    };


    //When user clicks to add show to their tracked list this will grab their firebase uid and attach it to the show object before it adds it to firebase
    $scope.addToTracked = function(show) {
        show.uid = AuthFactory.getUser();
        console.log(show);
        console.log(AuthFactory.getUser());
        DataFactory.addToTracked(show)
            .then((response) => {
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                });
    };







    //on partial load will run the getTopArtists function
    getTopArtists();


});
