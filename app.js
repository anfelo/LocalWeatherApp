$(document).ready(() => {
    var $body = $('body');
    var coords = [];
    var apiKey = '5f59b1ea7055522f0e417dbd5ec2087d';
    var iconsUrl = {
        "clear-day": { url: "img/clear-day.svg", color: "#e0ab18"},
        "clear-night": {url:"img/clear-night.svg", color: "#838cc7"},
        "rain": {url:"img/rain.svg", color: "#637a91"},
        "snow": {url:"img/snow.svg", color: "#b7c0c7"},
        "sleet": {url:"img/sleet.svg", color: "#637a91"},
        "wind": {url:"img/wind.svg", color: "#39add1"},
        "fog": {url:"img/fog.svg", color: "#b7c0c7"},
        "cloudy": {url:"img/cloudy.svg", color: "#3079ab"},
        "partly-cloudy-day": {url:"img/partly-cloudy-day.svg", color: "#39add1"},
        "partly-cloudy-night": {url:"img/partly-cloudy-night.svg", color: "#3079ab"},
    };

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
                showPosition(position);
            }, function (error) { 
                    if (error.code == error.PERMISSION_DENIED)
                        alert("Unable to determine local weather without permission to Geolocation.");
            });
        } else { 
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        coords = [position.coords.latitude, position.coords.longitude];
        requestWeather(coords);
    }

    function requestWeather(coordinates){
        var latitude = coordinates[0];
        var longitude = coordinates[1];
        $.getJSON(`https://crossorigin.me/https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}?units=si`,
            function(data){
                console.log(data);
                $('.temperature .value').html(data.currently.temperature);
                $('.icon img').prop('src',iconsUrl[data.currently.icon]['url']);
                $body.css('background-color', iconsUrl[data.currently.icon]['color']);
                $('.summary').html(data.currently.summary);
                $('.location').html(data.timezone);
                $('.humidity .value').html(data.currently.humidity * 100);
            }
        ).fail(() => {
            alert("Error: Unable to retrieve data from API.");
        });
    }

    function convertTemperature(value, unit) {
        console.log(value);
        if (unit === '°C') {
            // C=(F-32)*5/9
            $('.temperature .value').html(Math.round(((parseFloat(value)-32) * (5/9))*100 /100));
        } else {
            // F=(C*9/5)+32
            $('.temperature .value').html(Math.round(((parseFloat(value)*9/5) + 32)*100/100));
        }
    }

    getLocation();

    $('.unit-changer').on('click', event => {
        // Change unit value
        if($('.unit-changer').html() === 'Farenheit'){
            $('.temperature .unit').html('<strong>°F</strong>');
            $('.unit-changer').html('Celcius');
        } else {
            $('.temperature .unit').html('<strong>°C</strong>');
            $('.unit-changer').html('Farenheit');
        }
        // Calculate new Conversion
        convertTemperature($('.temperature .value').html(), $('.temperature .unit strong').html());
    });

});