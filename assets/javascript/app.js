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

// ------------------------------------
// Initial Train Schedule Values.
// Also store global variable for current time.

// Capture Submit Button Click.
// This is to add new trains.

// Don't refresh page on submit.

// Code in logic for storing new train schedule.
// Will need to call function that creates train times array.
// Will need to call function that calculates next arrival.
// Will need to call function that calculates minutes away.

// Don't forget to check in database that items are being stored.
// Use push instead of set, so multiple trains can get added.

// Retrieve list of trains using child_added
// Build up table in DOM.

// Write function that creates train times array.
// This function uses the first train time, and frequency.
// Creates an array of train times over 24 hour period.

// Write function that calculates next arrival.
// I'm thinking that you pass in the train times array.
// I'm thinking this is a for loop that goes through the array,
// Somehow comparing the array time to the current time.
// Once the train time is greater than the current time,
// That's the one that is set to the next arrival.

// Write function that calculates minutes away.
// Pass in next arrival time into this function.
// Compare current time to next arrival time.
// The difference of this is the minutes away.

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

