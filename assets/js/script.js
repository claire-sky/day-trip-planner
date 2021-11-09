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
        cityName.value = ""
        modal.classList.remove("is-active");
    } else {
        alert("Please enter a city name")
    }
}

// Event Listener
submit.addEventListener("click", citySearch)