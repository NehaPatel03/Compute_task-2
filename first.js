const currentDate = document.querySelector(".current-date");
const daysContainer = document.querySelector(".days");
const day = document.querySelector(".day"); //each day of the month
const prevNextIcons = document.querySelectorAll(".icons div");
const deleteBtn = document.querySelector("#delete-btn"); //delete button
const addEventBtn = document.querySelector("#add-event"); //add-event button
const eventModal = document.getElementById("eventModal");
const eventForm = document.getElementById("eventForm");   // Add event form
const closeBtn = document.querySelector(".fa-circle-xmark"); //close button of the events form
let eventsArray = JSON.parse(localStorage.getItem('events')) || [];  // Load events from localStorage
// JSON.parse() converts that string back into its original format, which in this case is likely an array of events. 
//localStorage in JavaScript is a built-in web storage API 

let date = new Date(); //date object is used to access current date, day and time
let eventsData = []; //To store the data fetched from the festivals API

// Close button of the form
closeBtn.addEventListener("click", () => {
    eventModal.classList.remove("active");
});

// To store the events in the local storage by clicking the add-event button
addEventBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const eventName = document.getElementById("eventName").value;       
    const eventDate = document.getElementById("eventDate").value;

    // Save event to localStorage
    const newEvent = { date: eventDate, name: eventName};
    eventsArray.push(newEvent);
    localStorage.setItem('events', JSON.stringify(eventsArray));
   // JSON.stringify() converts this JavaScript array (or object) into a JSON string. This is necessary because localStorage can only store data as strings, not as objects or arrays.

    // Hide modal and re-render calendar
    eventModal.classList.remove("active");
    createCalender();
});

//link to fetch festivals api
const url = "https://mocki.io/v1/7b47d683-984a-4fe8-9d40-4fc57a71145a";

// Fetch festival events from the API
const getEvents = async () => {
    let promise = await fetch(url);
    let data = await promise.json();
    eventsData = data.response.holidays; // Store the holidays array from the API
};
  
//To find current date, month and year
let currYear = date.getFullYear(); 
let currMonth = date.getMonth(); // getMonth() => 0 - 11
let today = date.getDate(); 


// Function to check if a day has an event in both API and localStorage
function checkForEvent(day, month, year) {
    const apiEvents = eventsData.filter(event => {
        const eventDate = new Date(event.date.iso);
        
        return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === 2019;
    });

    
    const localEvents = eventsArray.filter(event => {
        const eventDate = new Date(event.date);
        
        return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
   
    return [ ...apiEvents, ...localEvents];
}
var localLength= eventsArray.length;
console.log(localLength);

const months=["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//To create calendar of each month
function createCalender(){

    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(); //using 0 as the day will give last day of prev month hence also using (currMonth+1).
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(); //first day of the month
    let lastDateOfPrevMonth = new Date(currYear, currMonth, 0).getDate(); //last date of prev month
    let lastDayOfMonth = new Date(currYear, currMonth + 1, 0).getDay(); //last day of the month
    let dayTag = "";
    
    //prev days of the month
    for (let  i= firstDayOfMonth;  i>0; i--) {
        dayTag += `<div class="inactive">${lastDateOfPrevMonth - i + 1}</div>`; 
        
    }
    //current days of the month
    for (let i = 1; i <= lastDateOfMonth; i++) {
        let paddedMonth = (currMonth + 1).toString().padStart(2, "0");
        let paddedDay = i.toString().padStart(2, "0");

        const events = checkForEvent(i, currMonth,currYear); // Get events from both API and localStorage

        if (events.length > 0) {
            // If there are events on this day, display them
            let eventDetails = events.map(event => {
                return `<span class="event-name event-style">${event.name}</span>`;
            }).join('<br/>'); //to combine the elements of an array into a single string, with each element separated by the string '<br/>'
            dayTag += `<div class="day event-day" data-date="${currYear}-${paddedMonth}-${paddedDay}">${i}<br/>${eventDetails}</div>`; //YYYY-MM-DD
        } else {
            dayTag += `<div class="day" data-date="${currYear}-${paddedMonth}-${paddedDay}">${i}</div>`;
        }
        
       
    }

    //next days of the month
    for (let i = 1; i <= (6-lastDayOfMonth); i++) {
        dayTag += `<div class="inactive">${i}</div>`;
    }
    daysContainer.innerHTML = dayTag; 
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    // Add click event to open event form on day click
    document.querySelectorAll(".day").forEach(day => {
        day.addEventListener("click", function() {
            const selectedDate = this.getAttribute("data-date");
            document.getElementById("eventDate").value = selectedDate;
            eventModal.classList.add("active");
            
        });
    });
}
getEvents().then(() => {
    createCalender();
});

//prev and next icons functionality
prevNextIcons.forEach(icon => {
    icon.addEventListener("click", ()=>{
        icon.classList.add("icons-background");
        setTimeout(() => {
            icon.classList.remove("icons-background");
        }, 300);
        if(icon.id=="prev"){
            currMonth = currMonth -1;   
        }
        else{
            currMonth = currMonth + 1;
        }
        createCalender();
    } )
    
});
//to delete the data from the local storage
deleteBtn.addEventListener("click", ()=>{
    if (eventsArray.length > 0) {
        // Remove the last event
        eventsArray.pop();
        
        // Update localStorage
        localStorage.setItem('events', JSON.stringify(eventsArray));
        
        // Re-render the calendar to reflect the changes
        createCalender();
        
        console.log("Last event deleted");
    } 
    else {
        console.log("No events to delete");
    }
    eventModal.classList.remove("active");

})



