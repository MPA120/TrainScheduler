$(document).ready(function(){

    //Initializing Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyC8tGu6zPV2n__JKTWODPcwoJZZt-QrX0k",
    authDomain: "trainscheduler-2f22e.firebaseapp.com",
    databaseURL: "https://trainscheduler-2f22e.firebaseio.com",
    projectId: "trainscheduler-2f22e",
    storageBucket: "",
    messagingSenderId: "684603407024",
    appId: "1:684603407024:web:bfd756a242a8e8e4"
  };
  firebase.initializeApp(firebaseConfig);
  

  var database = firebase.database();

  $("#addTrain").on("click", function(event){
      event.preventDefault();

      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();

      database.ref().push({
          trainName: trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency: freq
      });
  });

  database.ref().on("child_added", function (childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");


    // Time difference
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder of time)
    var tRemainder = diffTime % newFreq;

    // Time Until Next Arrival
    var tMinutesTillTrain = newFreq - tRemainder;

    // The Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    $("#all-trains").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },

    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

});
  