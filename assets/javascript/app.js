// Initialize Firebase
var config = {
  apiKey: "AIzaSyDZpbJidZ7RLe50VDdpK5FYlR39rycy6ic",
  authDomain: "train-schedule-36c08.firebaseapp.com",
  databaseURL: "https://train-schedule-36c08.firebaseio.com",
  projectId: "train-schedule-36c08",
  storageBucket: "train-schedule-36c08.appspot.com",
  messagingSenderId: "699510031172"
};
firebase.initializeApp(config);

  var database = firebase.database();

  $(document).on("click", "#add-train-btn", function(event) {
      
    event.preventDefault(); //default action is to refresh page, and we're preventing that

    var name = $("#train-name").val().trim();
    var destination = $("#destination-input").val().trim();
    var startTime = $("#start-input").val().trim();
    var frequency = $("#tFrequency").val().trim();

    var trainEntry = {};
    trainEntry["name"] = name;
    trainEntry["destination"] = destination;
    trainEntry["startTime"] = startTime;
    trainEntry["frequency"] = frequency;
    trainEntry["addDate"] = firebase.database.ServerValue.TIMESTAMP

    database.ref().push(trainEntry);

  });

  database.ref().orderByChild("addDate").on("child_added", function(snapshot) {
      var sv = snapshot.val()

      var name = sv.name;
      var destination = sv.destination;
      var startTime = sv.startTime;
      var frequency = sv.frequency;
      var nextArrival = startTime;
      var currentTime = moment().format("HH:mm");
      var minutesAway = moment(nextArrival, "HH:mm").diff(moment(currentTime, "HH:mm"), "minutes");
      while (minutesAway < 0) {
          nextArrival = moment(nextArrival, "HH:mm").add(frequency, "minutes");
          nextArrival = moment(nextArrival).format("HH:mm")
          minutesAway = moment(nextArrival, "HH:mm").diff(moment(currentTime, "HH:mm"), "minutes");
      }

      var currentRow = $("<tr>")
      currentRow.append($("<td>").text(name));
      currentRow.append($("<td>").text(destination));
      currentRow.append($("<td>").text(frequency));
      currentRow.append($("<td>").text(nextArrival));
      currentRow.append($("<td>").text(minutesAway));

      $("#train-table").append(currentRow);
      location.refresh();
  });