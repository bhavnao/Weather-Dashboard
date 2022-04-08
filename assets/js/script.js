//open weather API key
var APIKey = "7fff4023f1901b4e3539220a32e09afa";

//function to search current weather of searched city
function searchCity(event){

    event.preventDefault();
    var cityInput = $("#searchcity").val();

    if(cityInput === ""){
        alert("Please select a city");
    }

    searchCurrentWeather(cityInput);
    displaySearchHistory(cityInput);

    $("#searchcity").val("");

}