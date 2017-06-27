// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
"use strict";

var app = angular.module("ShowsAround", ["ngRoute", "LocalStorageModule", "spotify", "ui.materialize"]);


//initializes firebase
app.run(function($rootScope, $location, FBCreds, AuthFactory) {
    firebase.initializeApp(FBCreds);
    $rootScope.isSpotify = false;
});


//Will determine if a user is logged in or not. If not will redirect them back to the home page to log in
let isAuth = (AuthFactory) =>
    new Promise((resolve, reject) => {
        AuthFactory.isAuthenticated()
            .then((userExists) => {
                if (userExists) {
                    console.log('Authenicated, go ahead');
                    resolve();
                } else {
                    console.log('Authenticated reject, GO AWAY');
                    reject();
                }
            });
    });


app.config(function($routeProvider) {
    // ********
    // ngRoute
    // ********

    // the routeProvider will help link partial URLS with their respective controllers
    // when the url ends with a specific path, ngRoute will load a certain URL partial that is controlled by a certain partial
    // these will be display in the <div ng-view></div> on the index.html.


    $routeProvider
        .when('/', {
            templateUrl: 'partials/firebaselogin.html',
            controller: 'AuthCtrl'

        })
        .when('/setlocation', {
            templateUrl: 'partials/setlocation.html',
            controller: 'NavCtrl',
            resolve: { isAuth }

        })
        .when('/spotify', {
            templateUrl: 'partials/spotifylogin.html',
            controller: 'AuthCtrl',
            resolve: { isAuth }

        })
        .when('/showslist', {
            templateUrl: 'partials/shows-list.html',
            controller: "ShowsListCtrl",
            resolve: { isAuth }

        })
        .when('/trackedshows', {
            templateUrl: 'partials/trackedshows.html',
            controller: "TrackedShowsCtrl",
            resolve: { isAuth }

        })
        .otherwise('/');


});




// *******
// SPOTIFY
// *******

// angular-spotify is an angularjs plugin that helps deal with iteracting with the spotify API. More info can be found at https://github.com/eddiemoore/angular-spotify#usage
app.config(function(SpotifyProvider, SpotifyCreds) {
    SpotifyProvider.setClientId(`${SpotifyCreds.ClientId}`);
    SpotifyProvider.setRedirectUri(`${SpotifyCreds.RedirectUri}`);
    SpotifyProvider.setScope(`${SpotifyCreds.Scope}`);
});






app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
