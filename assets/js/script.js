var cityForm = document.querySelector('#cityForm')
var cityName = document.querySelector('#city')
var submit = document.querySelector('#submit')
var modal = document.querySelector('#mainModal')
var previousCity = [];
// var tempMax = daily.max.temp;
// var windSpeed = daily.wind_speed;
// var rainFall = daily.rain;
const listItemsContainer= document.getElementById("list-items")
const itemInput= document.getElementById("item-input")
const itemsNull = document.getElementById('items-null')

// grabs input to verify if city was input, then calls another function (Would be API to grab lat/long)
var citySearch = function (event) {
    event.preventDefault()
    var city = cityName.value.trim()
    if (city) {
        // function would go here to be called
        cityName.value = ""
        // modal.classList.remove("is-active");
    }
    saveCity(city);
}

// save city search to local storage
var saveCity = function(city) {
    loadCities();
    for (var i = 0; i < previousCity.length; i++) {
        if (previousCity[i].city === city) {
            previousCity.splice([i], 1);
            break;
        };
    };
    if (previousCity.length > 4) {
        previousCity.shift();
    };
    previousCity.push({"city": city});
    localStorage.setItem("previousCity", JSON.stringify(previousCity));
};

// retrieve city from local storage
var loadCities = function() {
    previousCity = JSON.parse(localStorage.getItem("previousCity"));
    if (!previousCity) {
        previousCity = [];
    };
};

// recommended items based on max temperature
var tempRec = function(tempMax) {
    if (tempMax < 32) {
        return alert("Scarf, gloves, warm hat, heavy jacket");
    } else if (tempMax < 50) {
        return alert("Warm jacket");
    } else if (tempMax < 70) {
        return alert("Light jacket");
    } else if (tempMax < 85) {
        return alert("Water");
    } else {
        return alert("Water, sun hat");
    };
};

// recommended items based on wind speed
var windRec = function(windSpeed) {
    if (windSpeed < 12) {
        return "Light jacket";
    } else if (windSpeed < 30) {
        return "Wind breaker";
    } else if (windSpeed < 50) {
        return "Wind breaker and pants";
    } else {
        return "Wind speed is dangerous; recommended stay indoors";
    };
};

// recommended items based on rain
var rainRec = function(rainFall) {
    if (rainFall === 0) {
        return "";
    } else if (rainFall < 4) {
        return "Rain jacket or umbrella";
    } else if (rainFall < 9) {
        return "Umbrella, rain jacket";
    } else if (rainFall < 40) {
        return "Umbrella, rain jacket, rainboots";
    } else {
        return "Rain fall is dangerous; recommended stay indoors";
    };
};

// testing recommendations using a prompt until weather API is set up
// var tempMax = prompt("Enter a temperature 0-120");
// tempRec(tempMax);

// Event Listener
submit.addEventListener("click", citySearch)

function addItemsToBring(event) {
    if(event.keyCode===13 && itemInput.value){
       const itemName= itemInput.value
       const listItem=document.createElement('li')
       listItem.innerHTML = itemName
       itemsNull.style.display = 'none'
       listItemsContainer.appendChild(listItem)
       itemInput.value=''
    }
}
itemInput.addEventListener('keyup', addItemsToBring)