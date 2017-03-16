/* global moment firebase */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCzJWt3Q0dufPDDIf05HY5r4-i9ducyX08",
  authDomain: "train-scheduler-e00cb.firebaseapp.com",
  databaseURL: "https://train-scheduler-e00cb.firebaseio.com",
  storageBucket: "train-scheduler-e00cb.appspot.com",
  messagingSenderId: "987271742863"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Variables.
// ------------------------------------
// Initial Train Schedule Values.
var name = "";
var destination = "";
var frequency = 0;
var firstTrain = "";
var minutesAway = 0;
var schedule = [];
var firstTrainTotalMin = 0;
var trainTime = 0;
var currentTimeTotalMin = 0;
var nextArrival = 0;

// Capture Submit Button Click.
// TODO: Don't allow for empty submits!
$("#submit-train").on("click", function() {
  // Don't refresh page!
  event.preventDefault();

  // Get train data from DOM.
  name = $("#train-name").val().trim();
  firstTrain = $("#first-train").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();

  convertFirstTrainToMinutes(firstTrain);

  console.log("Schedule looks like this: " + schedule.toString());

  convertCurrentTimeToMinutes();

  determineNextTrain(currentTimeTotalMin, schedule);

  determineMinutesAway(nextArrival, currentTimeTotalMin);

  // Push data to database.
  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });


  // Clear out input text as a courtesy to your user.
  $("#train-name").val("");
  $("#first-train").val("");
  $("#destination").val("");
  $("#frequency").val("");
});

// The first thing to do is figure out the start time in minutes.
// Given we have military time-- there's two different equations:
// If AM, first train time in minutes = (hr * 60) + min;
// If PM, first train time in minutes = ((hr + 12) * 60) + min;
function convertFirstTrainToMinutes(firstTrain) {
  // Will start off with sample result to work through logic.
  firstTrain = moment(firstTrain, "hh:mm");
  firstTrainHours = firstTrain.hours();
  console.log("This is first train hours: " + firstTrainHours);
  firstTrainMin = firstTrain.minutes();
  console.log("This is first train minutes: " + firstTrainMin);
  firstTrainTotalMin = firstTrainMin + firstTrainHours*60;
  console.log("This is first train total minutes: " + firstTrainTotalMin);
  createTrainSchedule(firstTrainTotalMin, frequency);
}

function convertCurrentTimeToMinutes() {
  var currentHours = moment().hours();
  console.log("Current time hours: " + currentHours);
  var currentMinutes = moment().minutes();
  console.log("Current time minutes: " + currentMinutes);
  currentTimeTotalMin = currentMinutes + currentHours*60;
  console.log("This is the current time total minutes: " + currentTimeTotalMin);
}

// Write function that creates train times array.
// This function uses the first train time, and frequency.
// Creates an array of train times over 24 hour period.
function createTrainSchedule(firstTrainTotalMin, frequency) {
  for (var i = 0; trainTime < 1440; i++) {
    trainTime = firstTrainTotalMin + (frequency*i);
    if (trainTime > 1440) {
      console.log("Schedule array looks like this: " + schedule.toString());
      return schedule;
    } else {
      schedule.push(trainTime);
    }
  }
};

// Write function that calculates next arrival.
// I'm thinking that you pass in the train times array.
// I'm thinking this is a for loop that goes through the array,
// Somehow comparing the array time to the current time.
// Once the train time is greater than the current time,
// That's the one that is set to the next arrival.
// Will need to get hours and minutes for current time as part of this,
// Perhaps creating two smaller functions to do this.
// They need to be numeric values for comparison sake.
// Will also need to tack on AM or PM depending on time.
function determineNextTrain(currentTimeTotalMin, schedule) {

  //Scheduled train time after current time is next arrival time.
  for (var i = 0; i < schedule.length; i++) {
    if (schedule[i] > currentTimeTotalMin) {
      nextArrival = schedule[i];
      console.log("Next arrival time in minutes is: " + nextArrival);
      return nextArrival;
    }
  }
}


// Write function that calculates minutes away.
// Pass in next arrival time into this function.
// Compare current time to next arrival time.
// The difference of this is the minutes away.
function determineMinutesAway(nextArrival, currentTimeTotalMin) {

  // Just to get this running, simple placeholder.
  minutesAway = 5;
  return minutesAway;
}

// Retrieve list of trains using child_added
// Build up table in DOM.

// Bonus features:

// Make sure which ever bonus features I implement,
// That I move listeners together, functions together,
// And add appropriate global variables, if needed.

// Bonus feature one:
// Create a function that gets called every minute.
// This function will call the next arrival and minutes away functions.
// Basic gist is to keep these cells up-to-date.

// Bonus feature two:
// Add update and remove buttons for each train.
// This will be click event listeners.
// Remove should be fairly straightforward.
// Though table needs to be reconstructed.
// The update click will need to call next arrival and minutes away functions.

// Bonus feature three: 
// Use Firebase authentication so that only users logged in can use the site.
// Users can log in with Google or GitHub accounts.

// OK Math!
// I started to work out the various calculations, and I realized I needed to step back.
// And do some math!

// So I worked on paper, with a pen.
// And this is the logic that I came up with, that I want to preserve.

// First, the goal is to always work in minutes.
// At the very basic level, there are 1440 minutes in every day (24 * 60).

// Need to create an array of train times starting with the first train time,
// And then building up list of next train times by adding the frequency to previous train time,
// All the way up to 1440.

// To work out the next arrival, you find the item in the array
// Closest to the current time.

// Need to calculate the minutes in the current time.

// The number of minutes away is just the current time minus the minutes in the next train
// I think.

