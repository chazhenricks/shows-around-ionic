"use strict";

app.factory("AuthFactory", function($q, $http, $rootScope, FBCreds) {

    // **********
    // FIREBASE
    // **********

    // initially sets user data to null when there are no users
    let currentUserData = null;

    //Firebase: Register a new user with email and password
    let registerWithEmail = (user) => {
        return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log("error:", errorCode, errorMessage);
            });
    };

    // logs into firebase with user input email and password
    let login = (credentials) => {
        return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
            .catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log("error:", errorCode, errorMessage);
            });
    };

    //Firebase: Return email, UID for user that is currently logged in.
    let getUser = () => {
        return currentUserData;
    };

    // Kills browser cookie with firebase credentials
    let logout = () => {
        return firebase.auth().signOut();
    };

    // If the auth state changes(user logs in or out) will update currentUserData either with that users info or null, depending on if a user logs in or out
    let isAuthenticated = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUserData = user.uid;
                    console.log("user", user.uid);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

















    return { isAuthenticated, getUser, logout, registerWithEmail, login };
});
