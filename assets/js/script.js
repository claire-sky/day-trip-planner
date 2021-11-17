var cityForm = document.querySelector('#cityForm')
var cityName = document.querySelector('#city')
var submit = document.querySelector('#submit')
var modal = document.querySelector('#mainModal')
var previousCity = [];
var city = [];
var cityHistory = document.getElementById("city-history");
var cityElements = document.querySelector('#elements');
var cityBlock = document.querySelector('#city-name-block')
const listItemsContainer = document.getElementById("list-items");
const itemInput = document.getElementById("item-input");
let itemsList = [];
const itemsNull = document.getElementById('items-null');
var itemRec = document.getElementById("item-rec");
var tempMax = 0;
var windSpeed = 0;
var airQuality = 0;

// grabs input to verify if city was input, then calls another function (Would be API to grab lat/long)
var citySearch = function (event) {
    event.preventDefault()

    city = cityName.value.trim();
    if (city) {
        town(city);
        cityName.value = ""
    }
}

// API Calls and display weather
var town = function () {
    modal.classList.remove("is-active");
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6d1d7721cce65133dca83415077d7208&units=imperial"
    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {

                response.json().then(function (data) {
                    saveCity(city);

                    cityBlock.textContent = ""
                    var cityName = document.createElement("p")
                    cityName.classList = "box title has-text-centered"
                    cityName.textContent = "Get ready to visit " + data.name + "! Check out the weather below and plan what you want to bring along!"
                    cityBlock.appendChild(cityName)

                    tempMax = data.main.temp_max;
                    var cityTemp = document.createElement("p")
                    cityTemp.textContent = "Max temperature for the day: " + tempMax + " \u00B0F. "

                    var cityHumid = document.createElement("p")
                    cityHumid.textContent = "Humidity for the day: " + data.main.humidity + "%."

                    windSpeed = data.wind.speed
                    var cityWind = document.createElement("p")
                    cityWind.textContent = "Wind speed will be " + windSpeed + " MPH."

                    var date = new Date(data.sys.sunset * 1000)
                    var citySunset = document.createElement("p")
                    var hours = date.getHours()
                    if (hours > 12) {
                        hours = hours - 12;
                    }
                    citySunset.textContent = "Sunset will be at " + hours + ":" + date.getMinutes() + ":" + date.getSeconds() + "."

                    var lat = data.coord.lat
                    var lon = data.coord.lon

                    // air-quality api
                    var airQualityAPI = "https://api.breezometer.com/air-quality/v2/current-conditions?lat=" + lat + "&lon=" + lon + "&key=453aa725e6e640bea18ebffa1017eba3"
                    fetch(airQualityAPI)
                        .then(poly1 => poly1.json())
                        .then(poly2 => {
                            airQuality = poly2.data.indexes.baqi.category
                            var cityAirQuality = document.createElement("p")
                            cityAirQuality.textContent = airQuality + ". "
                            cityElements.append(cityTemp, cityHumid, cityWind, citySunset, cityAirQuality)
                        })
                    tempRec(tempMax);
                    windRec(windSpeed);
                    airRec(airQuality);

                })
            } else {
                modal.classList.add("is-active");
            }
        })
};


// save city search to local storage
var saveCity = function (city) {
    loadCities();

    // check city history for entered city and remove from history if match
    for (var i = 0; i < previousCity.length; i++) {
        if (previousCity[i].city === city) {
            previousCity.splice([i], 1);
            break;
        };
    };

    // limit saved cities to 6
    if (previousCity.length > 5) {
        previousCity.shift();
    };

    // add new city to history
    previousCity.push({ "city": city });
    localStorage.setItem("previousCity", JSON.stringify(previousCity));
    displayCities();
};

// retrieve city from local storage
var loadCities = function () {
    previousCity = JSON.parse(localStorage.getItem("previousCity"));
    if (!previousCity) {
        previousCity = [];
    };
};

// display cities on modal
var displayCities = function () {
    loadCities();
    // clear cities before loading
    while (cityHistory.hasChildNodes()) {
        cityHistory.removeChild(cityHistory.firstChild);
    };

    // loop through cities and add to modal
    for (var i = previousCity.length - 1; i >= 0; i--) {
        var btn = document.createElement("button");
        btn.type = "submit";
        btn.name = "formBtn";
        btn.classList.add("button", "pb-2", "cityBtn");
        btn.innerHTML = previousCity[i].city;
        btn.value = previousCity[i].city;

        // add each to modal
        cityHistory.appendChild(btn);
        // load weather when button is clicked
        btn.addEventListener("click", clickCity)
    };
};

// recommended items based on max temperature
var tempRec = function () {
    var tempRecResult = document.createElement("li");
    if (tempMax < 32) {
        tempRecResult.textContent = "Scarf, gloves, warm hat, heavy jacket"
        itemRec.append(tempRecResult);
    } else if (tempMax < 50) {
        tempRecResult.textContent = "Warm jacket"
        itemRec.append(tempRecResult);
    } else if (tempMax < 70) {
        tempRecResult.textContent = "Light jacket"
        itemRec.append(tempRecResult);
    } else if (tempMax < 85) {
        tempRecResult.textContent = "Water"
        itemRec.append(tempRecResult);
    } else {
        tempRecResult.textContent = "Water, sun hat"
        itemRec.append(tempRecResult);
    };
};

// recommended items based on wind speed
var windRec = function () {
    var windRecResult = document.createElement("li");
    if (windSpeed < 3) {
        return;
    } else if (windSpeed < 12) {
        windRecResult.textContent = "Light sweater"
        itemRec.append(windRecResult);
    } else if (windSpeed < 30) {
        windRecResult.textContent = "Wind breaker"
        itemRec.append(windRecResult);
    } else if (windSpeed < 50) {
        windRecResult.textContent = "Wind breaker and pants"
        itemRec.append(windRecResult);
    } else {
        windRecResult.textContent = "Wind speed is dangerous; recommended stay indoors"
        itemRec.append(windRecResult);
    };
};

// recommended items based on rain
var airRec = function () {
    var airRecResult = document.createElement("li");
    switch(airQuality) {
        case "Unhealthy air quality for sensitive groups":
            airRecResult.textContent = "Medical breathing device"
            itemRec.append(airRecResult);
            break;
        case "Unhealthy air quality":
            airRecResult.textContent = "Medical breathing device"
            itemRec.append(airRecResult);
            break;
        case "Very unhealthy air quality":
            airRecResult.textContent = "Air quality is very unhealthy; recommended limit outdoor activity";
            itemRec.append(airRecResult);
            break;
        case "Hazardous air quality":
            airRecResult.textContent = "Air quality is hazardous; recommended stay indoors";
            itemRec.append(airRecResult);
            break;
        default:
            "";
    }
};

// update city value when city button is clicked
function clickCity() {
    city = this.value;
    town();
};

// update item list with inputed item
function addItemsToBring(event) {
    if (event && event.keyCode === 13 && itemInput.value) {
        const itemName = itemInput.value
        itemsList.push(itemName)
        localStorage.setItem("itemsList", JSON.stringify(itemsList))
        renderItemsToDOM()

        // clear input field
        itemInput.value = ''
    }
}

// displaying items in list
function renderItemsToDOM() {
    listItemsContainer.innerHTML = ''
    itemsList = JSON.parse(localStorage.getItem("itemsList"))
    for (let i = 0; i < itemsList.length; i++) {
        // section for each item
        const itemContainer = document.createElement('div')
        itemContainer.style.display = "flex"
        itemContainer.style.justifyContent = "space-between"
        listItemsContainer.appendChild(itemContainer)

        // list each item
        const listItem = document.createElement('li')
        listItem.innerHTML = itemsList[i]
        itemContainer.appendChild(listItem)

        // delete button for each item
        const deletButton = document.createElement('button')
        deletButton.innerHTML = "x"
        deletButton.addEventListener('click', function () { removeItem(i) })
        itemContainer.appendChild(deletButton)
    }
};

// removing items from list
function removeItem(index) {
    const listItemsInStorage = JSON.parse(localStorage.getItem('itemsList'))
    listItemsInStorage.splice(index, 1)
    localStorage.setItem('itemsList', JSON.stringify(listItemsInStorage))
    renderItemsToDOM()
    if (listItemsInStorage.length === 0) {
        listItemsContainer.appendChild(itemsNull)
        localStorage.removeItem('itemsList')
        itemsList = []
    }
}

// Event Listener
submit.addEventListener("click", citySearch)
itemInput.addEventListener('keyup', addItemsToBring);
displayCities();

const listItemsInStorage = JSON.parse(localStorage.getItem('itemsList'))
if (listItemsInStorage.length) {
    renderItemsToDOM()
}