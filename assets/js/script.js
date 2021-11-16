var cityForm = document.querySelector('#cityForm')
var cityName = document.querySelector('#city')
var submit = document.querySelector('#submit')
var modal = document.querySelector('#mainModal')

// grabs input to verify if city was input, then calls another function (Would be API to grab lat/long)
var citySearch = function (event) {
    event.preventDefault()
    var city = cityName.value.trim()
    if (city) {
        // function would go here to be called
        town(city)
        cityName.value = ""
        modal.classList.remove("is-active");
    }
}

var town = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6d1d7721cce65133dca83415077d7208&units=imperial"
    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                console.log(apiUrl)
                //cityHistory.push(city)

                response.json().then(function (data) {
                    console.log(data)
                    var flat = data.coord.lat
                    var vert = data.coord.lon
                    // pollen api
                    var pollen = "https://api.breezometer.com/air-quality/v2/current-conditions?lat=" + flat + "&lon=" + vert + "&key=453aa725e6e640bea18ebffa1017eba3"
                    fetch(pollen)
                        .then(poly1 => poly1.json())
                        .then(poly2 => { console.log(poly2)})

                    console.log(flat, vert)
                })
            } else {
                alert("Not a valid city name!")
            }
        })
};



// Event Listener
submit.addEventListener("click", citySearch)



