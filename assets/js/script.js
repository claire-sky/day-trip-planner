var cityForm = document.querySelector('#cityForm')
var cityName = document.querySelector('#city')
var submit = document.querySelector('#submit')
var modal = document.querySelector('#mainModal')
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
        modal.classList.remove("is-active");
    } }

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