"use strict";

//login, logout, register

app.controller("AuthCtrl", function($scope, $window, $rootScope, $location, AuthFactory, DataFactory, Spotify) {

    $rootScope.isSpotify = false;
    // scope for registering new users
    $scope.auth = {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    };


    // logout firebase
    let logout = () => {
        console.log("NO ONE IS LOGGED IN");
        AuthFactory.logout()
            .then(function(data) {
                $window.location.url = "#!/";
            }, function(error) {
                console.log("error occured on logout");
            });
    };

    // when first loaded, make sure no one is logged in
    if (AuthFactory.isAuthenticated()) {
            $location.url('/spotify');
        }

    // adding a new user to firebase
    $scope.registerUser = function() {
        AuthFactory.registerWithEmail({
                email: $scope.auth.email,
                password: $scope.auth.password,
            })
            .then((userData) => {
                $scope.login();
                $('#registerModal').modal('close');

            }, (error) => {
                console.log("Error creating user:", error);
            });
    };


    // firebase login which redirects to spotify login page
    $scope.login = function() {
        AuthFactory.login($scope.auth)
            .then(() => {
                $scope.$apply();
                $location.url('/spotify');
            });
    };

    // spotify login function which utilizes the angular-spotify module
    $scope.spotifyLogin = () => {
        Spotify.login()
            .then((result) => {
                $scope.authToken = result;
                $location.path('/setlocation');
            });
    };

    // if you need it, this function will return the current authToken
    //   note* these expire after 2 minutes. If need toget user info aftert those 2 min you need to write a function that will use the refresh request token.

    $scope.getAuthToken = () => {
        return $scope.authToken;
    };


});
