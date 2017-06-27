"use strict";

app.factory("DataFactory", function($q, $http, $window, FBCreds, LocationFactory, $rootScope) {



    $rootScope.localShows = [];

    // deletes show from firebase based on the id of the object stored in firebase
    const removeShow = function(showId) {
        return $q((resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/shows/${showId}.json`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // take show object and adds it to firebase database
    const addToTracked = function(show) {
        return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/shows.json`, show)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // generates list of show objects from firebase based on uid
    const getTrackedShows = function(uid) {
        return $q((resolve, reject) => {
            $http.get(`${FBCreds.databaseURL}/shows.json?orderBy="uid"&equalTo="${uid}"`)
                .then((response) => {
                    var showsArray = [];
                    var listOfShows = response.data;
                    Object.keys(listOfShows).forEach((key) => {
                        listOfShows[key].id = key;
                        showsArray.push(listOfShows[key]);
                    });
                    resolve(showsArray);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    // Takes a users list of artist they entered and runs agains the bandsintown API and then filters by city and returns the matches
    const getShows = function(artist, city) {
        artist.name = artist.name.replace(/\s/g, '%20');
        return $q((resolve, reject) => {
            $http.get(`https://rest.bandsintown.com/artists/${artist.name}/events?app_id=shows_around`)
                .then((response) => {
                    console.log("reponse from getShows", response);
                    var showsArray = response.data;
                    showsArray.forEach((show) => {
                        if (show.venue.city === city) {
                            artist.datetime = show.datetime;
                            artist.city = show.venue.city;
                            artist.state = show.venue.region;
                            artist.venue = show.venue.name.toUpperCase();
                            if (show.offers[0]) {
                                artist.tickets = show.offers[0].url;
                            }
                            artist.lat = show.venue.latitude;
                            artist.long = show.venue.longitude;
                            console.log("artist from shows array", artist);
                            resolve(artist);
                        }
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const getSingleShow = function(artist) {
        var city = LocationFactory.getCurrentCity();
        return new Promise((resolve, reject) => {
            getShows(artist, city)
                .then((response) => {
                    var monthNum = response.datetime.slice(5, 7);
                    var mm = "";
                    //converts month numbers to words
                    switch (monthNum) {
                        case "01":
                            mm = "January";
                            break;
                        case "02":
                            mm = "February";
                            break;

                        case "03":
                            mm = "March";
                            break;

                        case "04":
                            mm = "April";
                            break;

                        case "05":
                            mm = "May";
                            break;

                        case "06":
                            mm = "June";
                            break;

                        case "07":
                            mm = "July";
                            break;

                        case "08":
                            mm = "August";
                            break;

                        case "09":
                            mm = "September";
                            break;

                        case "10":
                            mm = "October";
                            break;

                        case "11":
                            mm = "November";
                            break;

                        case "12":
                            mm = "December";
                            break;
                    }

                    var dd = response.datetime.slice(8, 10);
                    var yy = response.datetime.slice(0, 4);
                    var date = `${mm} ${dd}, ${yy}`;

                    //Converts 24hr time to 12hr time
                    var hr = response.datetime.slice(11, 13);
                    var min = response.datetime.slice(14, 16);
                    var time = "";
                    if (hr > 12) {
                        hr = hr - 12;
                        time = `${hr}:${min} PM`;
                    } else if (hr < 13) {
                        time = `${hr}:${min} AM`;
                    }


                    //removes %20 needed to represent spaces in the URL call for display purposes
                    response.name = response.name.replace(/%20/g, ' ');
                    response.monthNum = monthNum;
                    response.date = date;
                    response.time = time;
                    $rootScope.localShows = [];
                    $rootScope.localShows.push(response);
                    resolve(response);
                });
        });
    };



    //Gets back the array of shows that match the specified city and parses the data into an object we can use to populate the page.
    const getArtistsShows = function(artists) {
        var localShows = [];
        var city = LocationFactory.getCurrentCity();
        console.log("artistShows city", city);
        return new Promise((resolve, reject) => {
            $rootScope.localShows = [];
            artists.forEach((item) => {
                getShows(item, city)
                    .then((response) => {
                        var monthNum = response.datetime.slice(5, 7);
                        var mm = "";
                        //converts month numbers to words
                        switch (monthNum) {
                            case "01":
                                mm = "January";
                                break;
                            case "02":
                                mm = "February";
                                break;

                            case "03":
                                mm = "March";
                                break;

                            case "04":
                                mm = "April";
                                break;

                            case "05":
                                mm = "May";
                                break;

                            case "06":
                                mm = "June";
                                break;

                            case "07":
                                mm = "July";
                                break;

                            case "08":
                                mm = "August";
                                break;

                            case "09":
                                mm = "September";
                                break;

                            case "10":
                                mm = "October";
                                break;

                            case "11":
                                mm = "November";
                                break;

                            case "12":
                                mm = "December";
                                break;
                        }

                        var dd = response.datetime.slice(8, 10);
                        var yy = response.datetime.slice(0, 4);
                        var date = `${mm} ${dd}, ${yy}`;

                        //Converts 24hr time to 12hr time
                        var hr = response.datetime.slice(11, 13);
                        var min = response.datetime.slice(14, 16);
                        var time = "";
                        if (hr > 12) {
                            hr = hr - 12;
                            time = `${hr}:${min} PM`;
                        } else if (hr < 13) {
                            time = `${hr}:${min} AM`;
                        }
                        //removes %20 needed to represent spaces in the URL call for display purposes
                        response.name = response.name.replace(/%20/g, ' ');
                        response.monthNum = monthNum;
                        response.date = date;
                        response.time = time;

                        $rootScope.localShows.push(response);
                        console.log("localShows", $rootScope.localShows);
                    }, (error) => {
                        console.error(error);
                    });
            });
            resolve($rootScope.localShows);
        });
    };




    return {
        getShows,
        addToTracked,
        getTrackedShows,
        removeShow,
        getArtistsShows,
        getSingleShow
    };

});
