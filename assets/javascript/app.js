// Global moment Firebase
var config = {
  apiKey: "AIzaSyCzJWt3Q0dufPDDIf05HY5r4-i9ducyX08",
  authDomain: "train-scheduler-e00cb.firebaseapp.com",
  databaseURL: "https://train-scheduler-e00cb.firebaseio.com",
  storageBucket: "train-scheduler-e00cb.appspot.com",
  messagingSenderId: "987271742863"
};

// Initialize Firebase
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
var nextArrivalInMin = 0;
var nextArrival = "";

// Capture Submit Button Click.
$("#submit-train").on("click", function() {
  // Don't refresh page!
  event.preventDefault();

  // Get train data from DOM.
  name = $("#train-name").val().trim();
  firstTrain = $("#first-train").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();

  // Convert current time to minutes.
  convertCurrentTimeToMinutes();

  // Convert first train time to minutes.
  convertFirstTrainToMinutes(firstTrain);

  // If frequncy is less than a day...
  if (frequency < 1440) {

    // Create train schedule using first train time and frequency.
    createTrainSchedule(firstTrainTotalMin, frequency);

    // Determine next train using current time and schedule.
    determineNextTrain(currentTimeTotalMin, schedule);

    // Determine minutes till next arrival.
    determineMinutesAway(nextArrivalInMin, currentTimeTotalMin);

    // else if the frequency is greater than a day...
  } else {

    // Simply set the next arrival time using first train time
    // And using the remainder of the frequency divided by a day.
    nextArrivalInMin = firstTrainTotalMin + (frequency%1440);

    // Determine the next train based on current time and next arrival.
    determineNextTrain(currentTimeTotalMin, nextArrivalInMin);

    // Determine minutes away using first train total in minutes and frequency.
    minutesAway = parseFloat(firstTrainTotalMin) + parseFloat(frequency);
  }

  // Convert next train to hours and minutes for display.
  convertNextTrainToHoursMin(nextArrivalInMin);

  // Clear out input text as a courtesy to your user.
  $("#train-name").val("");
  $("#first-train").val("");
  $("#destination").val("");
  $("#frequency").val("");

  // Push data to database.
  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });

});

// Firebase watcher
// Retrieve list of trains using child_added
database.ref().on("child_added", function(snapshot) {
  
  // Build up train table in DOM.
  $("#trains").append("<tr>" +
                        "<th>" + snapshot.val().name + "</th>" +
                        "<th>" + snapshot.val().destination + "</th>" +
                        "<th>" + snapshot.val().frequency + "</th>" +
                        "<th>" + snapshot.val().nextArrival + "</th>" +
                        "<th>" + snapshot.val().minutesAway + "</th>" +
                      "</tr>");
});

// Convert first train tim minutes using moment.js.
function convertFirstTrainToMinutes(firstTrain) {

  firstTrain = moment(firstTrain, "hh:mm");
  firstTrainHours = firstTrain.hours();
  firstTrainMin = firstTrain.minutes();

  // Calculation to add up the minutes.
  firstTrainTotalMin = firstTrainMin + firstTrainHours*60;
}

// Convert current time to minutes using moment.js.
// We want to compare like to like, hence conversions.
function convertCurrentTimeToMinutes() {
  var currentHours = moment().hours();
  var currentMinutes = moment().minutes();

  // Calculation to add up the minutes.
  currentTimeTotalMin = currentMinutes + currentHours*60;
}

// Creates an array of train times over 24 hour period.
function createTrainSchedule(firstTrainTotalMin, frequency) {
  
  // Need to reset these values to create new schedule array.
  trainTime = 0;
  schedule = [];
  for (var i = 0; trainTime < 1440; i++) {
    trainTime = firstTrainTotalMin + (frequency*i);
    if (trainTime > 1440) {
      return schedule;
    } else {
      schedule.push(trainTime);
    }
  }
};

// Determine current train using current time and schedule.
function determineNextTrain(currentTimeTotalMin, schedule) {

  //Scheduled train time after current time is next arrival time.
  for (var i = 0; i < schedule.length; i++) {
    if (schedule[i] > currentTimeTotalMin) {
      nextArrivalInMin = schedule[i];
      return nextArrivalInMin;
    }
  }
}

// Convert next train to hours and minutes for display.
function convertNextTrainToHoursMin(nextArrivalInMin) {
  var nextArrivalHours = Math.floor(nextArrivalInMin / 60);
  var ampm = "";

  // Also figure out if time is AM or PM.
  if (nextArrivalHours > 12) {
    nextArrivalHours = nextArrivalHours - 12;
    ampm = "PM";
  } else {
    nextArrivalHours = nextArrivalHours;
    ampm = "AM";
  }
  var nextArrivalMin = nextArrivalInMin % 60;
  if (nextArrivalHours < 10) {
    nextArrivalHours = "0" + nextArrivalHours;
  }
  if (nextArrivalMin < 10) {
    nextArrivalMin = "0" + nextArrivalMin;
  }
  nextArrival = nextArrivalHours + ":" + nextArrivalMin + " " + ampm;
}


// Determine minutes away for next train.
function determineMinutesAway(nextArrivalInMin, currentTimeTotalMin) {

  // Minutes away is simply next arrival minus current time.
  minutesAway = nextArrivalInMin - currentTimeTotalMin;

  return minutesAway;
}

