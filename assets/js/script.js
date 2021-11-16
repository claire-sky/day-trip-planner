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


// grabs input to verify if city was input, then calls another function (Would be API to grab lat/long)
var citySearch = function (event) {
    event.preventDefault()
    city = cityName.value.trim()
    if (city) {
        // function would go here to be called
        town(city)
        cityName.value = ""
        modal.classList.remove("is-active");
    }
    saveCity(city);
}
// API Calls
var town = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6d1d7721cce65133dca83415077d7208&units=imperial"
    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                //cityHistory.push(city)

                response.json().then(function (data) {
                    console.log(data)
                    cityBlock.textContent = ""
                    var cityName = document.createElement("p")
                    cityName.classList = "box title has-text-centered"
                    cityName.textContent = "Get ready to visit " + data.name + "! Check out the weather below and plan what you want to bring along!"
                    cityBlock.appendChild(cityName)

                    var cityTemp = document.createElement("p")
                    cityTemp.textContent = "Max Temperature for the day: " + data.main.temp_max + "\u00B0F. "

                    var cityHumid = document.createElement("p")
                    cityHumid.textContent = " Humidity for the day: " + data.main.humidity + "%."

                    var cityWind = document.createElement("p")
                    cityWind.textContent = " Wind Speed will be " + data.wind.speed + " MPH."

                    var date = new Date(data.sys.sunset * 1000)
                    var citySunset = document.createElement("p")
                    citySunset.textContent = " Sunset will be at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "."

                    var flat = data.coord.lat
                    var vert = data.coord.lon
                    // pollen api
                    var pollen = "https://api.breezometer.com/air-quality/v2/current-conditions?lat=" + flat + "&lon=" + vert + "&key=453aa725e6e640bea18ebffa1017eba3"
                    fetch(pollen)
                        .then(poly1 => poly1.json())
                        .then(poly2 => { console.log(poly2)
                            var pollenCount = document.createElement("p")
                            pollenCount.textContent = " The Air Quality Index for the day will be: " + poly2.data.indexes.baqi.aqi + ". "
                            cityElements.textContent = cityTemp.innerHTML + cityHumid.innerHTML + cityWind.innerHTML + citySunset.innerHTML + pollenCount.innerHTML
                        })
                })
            } else {
                alert("Not a valid city name!")
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
var tempRec = function (tempMax) {
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
var windRec = function (windSpeed) {
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
var rainRec = function (rainFall) {
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

// update city value when city button is clicked
function clickCity() {
    city = this.value;
    citySearch();
};

// update item list with inputed item
function addItemsToBring(event) {
    if (event && event.keyCode === 13 && itemInput.value) {
        const itemName = itemInput.value
        itemsList.push(itemName)
        localStorage.setItem("itemsList", JSON.stringify(itemsList))
        renderItemsToDOM()
        itemInput.value = ''
    }
}

function renderItemsToDOM() {
    listItemsContainer.innerHTML = ''
    const itemsList = JSON.parse(localStorage.getItem("itemsList"))
    for (let i = 0; i < itemsList.length; i++) {
        const listItem = document.createElement('li')
        listItem.innerHTML = itemsList[i]
        const deletButton = document.createElement('button')
        deletButton.innerHTML = "x"
        deletButton.addEventListener('click', function () { removeItem(i) })
        const itemContainer = document.createElement('div')
        itemContainer.style.display = "flex"
        itemContainer.style.justifyContent = "space-between"
        itemContainer.appendChild(listItem)
        itemContainer.appendChild(deletButton)
        listItemsContainer.appendChild(itemContainer)
    }
};

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
if(listItemsInStorage.length) {
  renderItemsToDOM()
} 