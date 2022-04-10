//open weather API key
var APIKey = "7fff4023f1901b4e3539220a32e09afa";
var latitude = "";
var longitude = "";

//function to search current weather of searched city
function searchCity(event) {

    event.preventDefault();
    var cityInput = $("#searchcity").val();


    if (cityInput === "") {
        alert("Please select a city");
    }
     cityInput = cityInput.toUpperCase();

    searchCurrentWeather(cityInput);
    //displaySearchHistory(cityInput);
    populateSearchHistory(cityInput);

    $("#searchcity").val("");
    // 5 day forecast from onecall api
    $("#5DayForecast").show();
    $("#allForecast").empty();
}

//function to fetch current weather from weather data api on openweathermap
function searchCurrentWeather(city) {

    //https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid={API key}
    var searchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    //search current weather
    fetch(searchURL).then(function (response) {
        console.log("Search query URL :" + searchURL);
        return response.json();
    }).then(function (data) {
        console.log(data);

        if (data.main != null) {
            var tempF = (data.main.temp - 273.15) * 1.80 + 32;
            var tempC = (data.main.temp - 273.15);
            console.log(tempF);
            var currentDate = new Date().toLocaleDateString();
            latitude = data.coord.lat;
            longitude = data.coord.lon;
            searchCurrentConditions(longitude, latitude);
            var cityId = data.id;
            var forecast = data.weather[0].main;

            $("#city-card").show();
            $("#temperature").text("Temperature : " + tempF.toFixed(2) + " °F/ " + tempC.toFixed(2) + "°C");
            $("#weather").text("Weather : " + forecast);
            $("#humidity").text("Humidity : " + data.main.humidity + " %");
            $("#windspeed").text("Wind Speed : " + data.wind.speed + " MPH");
            var imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon.toString() + ".png");
            $("#city-name").text(data.name + "(" + currentDate + ")").append(imageIcon);
              
        }
        else {
            $("#city-name").text("Please enter a valid city name:-" + city).append(imageIcon);
        }
    });

}

function searchCurrentConditions(longitude, latitude) {
    var searchConditionsURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${APIKey}`;
    fetch(searchConditionsURL).then(function (response) {
        return response.json();
    }).then(function (val) {
        console.log(val);
        //getting UV Index from onecall api
        var uvVal = val.current.uvi;
        var uvBtn = $("<button>").attr("type", "button").text(uvVal);
        //uv index color
        if (uvVal >= 0 && uvVal <= 3) {

            //low : green
            $("#uvindex").text("UV : Favorable, ").append(uvBtn);
            uvBtn.addClass("btn bg-success");
        }
        else if (uvVal >= 3 && uvVal <= 7) {

            //moderate : yellow
            $("#uvindex").text("UV : Moderate, ").append(uvBtn);
            uvBtn.addClass("btn yellowBtn");
        }      
        else { //if(uvVal >= 8 && uvVal <= 10) {

            //very high : red
            $("#uvindex").text("UV : Extreme, ").append(uvBtn);
            uvBtn.addClass("btn bg-danger");
        }
        

        displayFiveDaysForecast(val.daily);
    });
    // 5 day forecast from onecall api
    $("#5DayForecast").show();
    $("#allForecast").empty();
}

function displayFiveDaysForecast(allDays) {
    for (var i = 1; i < 6; i++) {
        var dateForecast = moment.unix( allDays[i].dt).format("MM/DD/YYYY");
        
       var temp = allDays[i].temp;
       var humidity = allDays[i].humidity;
       var icn = allDays[i].weather[0].icon;
       var wind = allDays[i].wind_speed;


        var card = $("<div>").addClass("col-3 card bg-primary text-white");
        var cardBody = $("<div>").addClass("card-body");

        var fDate = $("<h5>").addClass("card-text").text(dateForecast);
        var imgIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + icn + ".png");

        var tempF = (temp.day - 273.15) * 1.80 + 32;
        var tempP = $("<p>").addClass("card-text").text("Temp : " + tempF.toFixed(2) + "°F");

        var humidityP = $("<p>").addClass("card-text").text("Humidity : " + humidity + " % ");
        var windP =  $("<p>").addClass("card-text").text("Wind Speed : " + wind + " MPH ");
        cardBody.append(fDate, imgIcon, tempP, humidityP, windP);
        card.append(cardBody);

        $("#allForecast").append(card);
    }
};

// function to store and populate search history
function populateSearchHistory(city){

    var history = JSON.parse(localStorage.getItem("history"));  
    var listitem;

    // If exists 
    if(history){

        for(var i = 0 ; i < history.length; i++){
            
            if(history[i] === city){
                return;
            }         
        } 
        history.unshift(city); 
        listitem = $("<li>").addClass("list-group-item previousCity").text(city);
        $("#historylist").prepend(listitem);    
    }
    else{
            history = [city]; 
            
            listitem = $("<li>").addClass("list-group-item previousCity").text(city);
            $("#historylist").append(listitem);

    }

    localStorage.setItem("history", JSON.stringify(history));   
}


// onclick function on search history city to load weather of that city 
$("#historylist").on("click", "li", function(event){

    var previousCityName = $(this).text();
    console.log("Previous city : "+ previousCityName);

    searchCurrentWeather(previousCityName);

});

// Execute script when html is fully loaded
$(document).ready(function(){

    $("#searchButton").on("click",searchCity);

    var history = JSON.parse(localStorage.getItem("history"));  
    
    // if search history exists in local storage
    if (history) {
        var lastSearchedCity = history[0];  //takes last searched city from localstorage
        searchCurrentWeather(lastSearchedCity); //loads last searched city's weather

        for(var i = 0 ; i < history.length; i++){
            
            var listitem = $("<li>").addClass("list-group-item previousCity").text(history[i]);  //populate search history in local storage to html page when page loads
            $("#historylist").append(listitem);    
            
        }
    } else {
        $("#city-card").hide();
        $("#5DayForecast").hide();
    }
});


