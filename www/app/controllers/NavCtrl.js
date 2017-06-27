"use strict";

app.controller("NavCtrl", function($scope, $location, AuthFactory, DataFactory, LocationFactory, $timeout, $route, Spotify, $rootScope) {


    //This determines if a user is logged in to trigger some ng-show elements in the navbar.html partial
    $scope.isLoggedIn = false;

    $scope.newArtist = {
        name: ""
    };

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.isLoggedIn = true;
            console.log("currentUser logged in", user, $scope.isLoggedIn);
            $scope.$apply();
        } else {
            $scope.isLoggedIn = false;
            console.log("currentUser logged in", $scope.isLoggedIn);
            $location.path("/");
        }
    });

    // logout firebase
    $scope.logout = () => {
        console.log("NO ONE IS LOGGED IN");
        AuthFactory.logout()
            .then(function(data) {
                $location.path("#!/");
                console.log(AuthFactory.getUser());
            }, function(error) {
                console.log("error occured on logout");
            });
    };

    $scope.getNewArtist = function() {
        Spotify.search($scope.newArtist.name, 'artist').
        then((response) => {
            console.log("Response From Spotify Search", response);
            $scope.newArtist.picture = response.data.artists.items[0].images[0].url;
        });
        DataFactory.getSingleShow($scope.newArtist)
            .then((response) => {
                // $route.reload();
            });
    };

    // if user enters new city this will change the city to search by in the Location Factory
    $scope.newCity = function() {
        LocationFactory.newCity($scope.newLocation.city);
        $("#locationModal").modal('close');
        $location.url('/showslist');
        $scope.newLocation.city = "";
    };


    $scope.reloadPage = function() {
        $route.reload();
    };

    $scope.showLocation = function() {
        console.log("Show Location", LocationFactory.getCurrentCity());
    };

    // triggers the LocationFactory to get the current city - since it is a javascript method and not a promise, need to use a timeout to make sure the browser has had enough time to gather the info before sending it to the getCityByCoords function
    $scope.getCurrentLocation = function() {
        LocationFactory.getCoords()
            .then((coords) => {
                    $scope.currentLocation = coords;
                    return LocationFactory.getCityByCoords($scope.currentLocation.lat, $scope.currentLocation.long);
                },
                () => {
                    console.error("ERROR GETTING COORDINATES");
                })
            .then(() => {
                $("#loadingModal").modal('close');
                $location.url('/showslist');
                $route.reload();
            });
    };

});
