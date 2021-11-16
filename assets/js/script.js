var cityForm = document.querySelector('#cityForm')
var cityName = document.querySelector('#city')
var submit = document.querySelector('#submit')
var modal = document.querySelector('#mainModal')
var previousCity = [];
let itemsList = [];

// var tempMax = daily.max.temp;
// var windSpeed = daily.wind_speed;
// var rainFall = daily.rain;
const listItemsContainer = document.getElementById("list-items")
const itemInput = document.getElementById("item-input")
const itemsNull = document.getElementById('items-null')

// grabs input to verify if city was input, then calls another function (Would be API to grab lat/long)
var citySearch = function (event) {
  event.preventDefault()
  var city = cityName.value.trim()
  if (city) {
    // function would go here to be called
    cityName.value = ""
    modal.classList.remove("is-active");
  }
  saveCity(city);
}

// save city search to local storage
var saveCity = function (city) {
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
  previousCity.push({ "city": city });
  localStorage.setItem("previousCity", JSON.stringify(previousCity));
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

  // loop through cities and add to modal
  for (var i = 0; i < previousCity.length; i++) {
    var btn = document.createElement("button");
    btn.type = "submit";
    btn.name = "formBtn";
    btn.classList.add("button", "is-info", "pb-2", "cityBtn");
    btn.innerHTML = previousCity[i].city;

    // add each to modal
    document.getElementById("prior-city").appendChild(btn);
    btn.addEventListener("click", citySearch)
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

// testing recommendations using a prompt until weather API is set up
// var tempMax = prompt("Enter a temperature 0-120");
// tempRec(tempMax);

// Event Listener
submit.addEventListener("click", citySearch)

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
  const itemsList=JSON.parse(localStorage.getItem("itemsList")) 
  for (let i = 0; i < itemsList.length; i++) {
    const listItem = document.createElement('li')
    listItem.innerHTML = itemsList[i]
    const deletButton = document.createElement('button')
    deletButton.innerHTML = "x"
    deletButton.addEventListener('click', function(){removeItem(i)})
    const itemContainer = document.createElement('div')
    itemContainer.style.display = "flex"
    itemContainer.style.justifyContent = "space-between"
    itemContainer.appendChild(listItem)
    itemContainer.appendChild(deletButton)
    listItemsContainer.appendChild(itemContainer)
}
}
function removeItem(index) {
  const listItemsInStorage = JSON.parse(localStorage.getItem('itemsList'))
  listItemsInStorage.splice(index, 1)
  localStorage.setItem('itemsList', JSON.stringify(listItemsInStorage))
  renderItemsToDOM()
  if(listItemsInStorage.length === 0) {
    listItemsContainer.appendChild(itemsNull)
    localStorage.removeItem('itemsList')
    itemsList = []
  }
}
itemInput.addEventListener('keyup', addItemsToBring);
displayCities();

const listItemsInStorage = JSON.parse(localStorage.getItem('itemsList'))
if(listItemsInStorage.length) {
  renderItemsToDOM()
}