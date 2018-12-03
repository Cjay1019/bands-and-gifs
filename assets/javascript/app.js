// LIST OF BANDS TO BE DISPLAYED ON PAGE LOAD
var bands = [
  "Weezer",
  "Blink 182",
  "My Chemical Romance",
  "Paramore",
  "Metallica",
  "Maroon 5",
  "Panic at the Disco",
  "Fall Out Boy",
  "Imagine Dragons",
  "The Killers",
  "BTS"
];

// COUNTER FOR GIF SWAPPING
var currentGif = 1;
// STORES RATING DISPLAY ON THE GLOBAL SCOPE
var rating;

// INITIALIZATION
printButtons();

// NEW BUTTON CLICK HANDLER ADDS USER'S NEW BAND
$("#add-band-button").on("click", function(e) {
  e.preventDefault();
  var newBand = $("#new-band-input").val();
  bands.push(newBand);
  printButtons();
});
// PLAYING AND PAUSING GIF CLICK HANDLER
$("#modal-body").on("click", ".band-images", onOFF);
// UPCOMING SHOWS BUTTON CLICK HANDLER
$("#modal-body").on("click", "#shows-button", printBandInfo);
// BAND NAME BUTTON CLICK HANDLER
$("#buttons-section").on("click", ".band-button", printGifs);
// CHANGE GIF BUTTON CLICK HANDLER
$(".modal-footer").on("click", "#new-gif-button", changeGif);

// OPENS THE MODAL AND PRINTS BAND GIF, GIF RATING, BAND NAME, AND SHOWS BUTTON
function printGifs() {
  var currentBand = $(this).attr("data-name");
  currentGif = 1;
  $("#new-gif-button").attr("data-name", currentBand);
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    currentBand +
    "-band" +
    "&api_key=sRyL14LTX3neCJUAbSNhNNlQPoidsBIA&rating=pg";
  queryURL = queryURL.replace(/\s+/g, "-");
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var stillURL = response.data[0].images.fixed_height_still.url;
    var loopURL = response.data[0].images.fixed_height.url;
    rating = response.data[0].rating;
    var gifDiv = $("<div>").attr("id", "gif-div");
    var ratingP = $("<p>")
      .attr("id", "rating")
      .text("Gif rating: " + rating.toUpperCase() + " (Click the gif to play)");
    var showsButton = $("<div>")
      .attr({
        id: "shows-button",
        class: "btn btn-mdb-color",
        "data-name": currentBand
      })
      .text("See upcoming shows");
    var bandImage = $("<img>").attr({
      src: stillURL,
      alt: "band image",
      "data-state": "still",
      "data-still": stillURL,
      "data-loop": loopURL,
      id: "band-gif",
      class: "band-images img-fluid hoverable rounded"
    });
    $("#band-title").text(currentBand.toUpperCase());
    gifDiv.append(ratingP);
    gifDiv.append(bandImage);
    gifDiv.append("<br>");
    gifDiv.append(showsButton);
    $("#modal-body").html(gifDiv);
  });
}

// CYCLES THROUGH THE 25 GIFS IN THE JSON OBJECT AND PRINTS OVER THE LAST ONE DISPLAYED
function changeGif() {
  var currentBand = $(this).attr("data-name");
  if (currentGif > 23) {
    currentGif = 0;
  } else {
    currentGif++;
  }
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    currentBand +
    "-band" +
    "&api_key=sRyL14LTX3neCJUAbSNhNNlQPoidsBIA&rating=pg";
  queryURL = queryURL.replace(/\s+/g, "-");
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var stillURL = response.data[currentGif].images.fixed_height_still.url;
    var loopURL = response.data[currentGif].images.fixed_height.url;
    rating = response.data[currentGif].rating;
    $("#rating").text(
      "Gif rating: " + rating.toUpperCase() + " (Click the gif to play)"
    );
    $("#band-gif").attr({
      src: stillURL,
      alt: "band image",
      "data-state": "still",
      "data-still": stillURL,
      "data-loop": loopURL,
      id: "band-gif"
    });
  });
}

// PRINTS THE BANDS UPCOMING SHOWS CAPPED AT 3 OR PRINTS A NO SHOWS MESSAGE
function printBandInfo() {
  var currentBand = $(this).attr("data-name");
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    currentBand +
    "/events/?app_id=codingbootcamp";
  queryURL = queryURL.replace(/\s+/g, "");
  $("#shows-button").remove();
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var showsH2 = $("<h2>").text("Upcoming Shows");
    if (response.length == 0) {
      var noShows = $("<h2>").text("No upcoming shows");
      $("#gif-div").append(noShows);
    } else if (response.length > 2) {
      $("#gif-div").append(showsH2);
      for (i = 0; i < 3; i++) {
        var dateTime = response[i].datetime;
        dateTime = moment(dateTime).format("MM/DD/YYYY");
        var venue = $("<p>")
          .text(response[i].venue.name)
          .attr("id", "venue");
        var date = $("<p>")
          .text(dateTime)
          .attr("id", "date");
        var location = $("<p>")
          .text(
            response[i].venue.city +
              ", " +
              response[i].venue.region +
              ", " +
              response[i].venue.country
          )
          .attr("id", "location");

        $("#gif-div").append(date);
        $("#gif-div").append(venue);
        $("#gif-div").append(location);
      }
    } else {
      $("#gif-div").append(showsH2);
      for (j = 0; j < response.length; j++) {
        var venue = $("<p>").text(response[j].venue.name);
        var date = $("<p>").text(response[j].datetime);
        var location = $("<p>").text(
          response[j].venue.city +
            ", " +
            response[j].venue.region +
            ", " +
            response[j].venue.country
        );
        $("#gif-div").append(date);
        $("#gif-div").append(venue);
        $("#gif-div").append(location);
      }
    }
  });
}

// PLAYS AND PAUSES THE DISPLAYED GIF
function onOFF() {
  var currentState = $(this).attr("data-state");
  var currentLoopURL = $(this).attr("data-loop");
  var currentStillURL = $(this).attr("data-still");
  if (currentState === "still") {
    $(this).attr({ "data-state": "loop", src: currentLoopURL });
    $("#rating").text(
      "Gif rating: " + rating.toUpperCase() + " (Click the gif to stop)"
    );
  } else {
    $(this).attr({ "data-state": "still", src: currentStillURL });

    $("#rating").text(
      "Gif rating: " + rating.toUpperCase() + " (Click the gif to play)"
    );
  }
}

// PRINTS BANDS ARRAY AS BUTTONS
function printButtons() {
  $("#buttons-section").empty();
  for (i = 0; i < bands.length; i++) {
    var newButton = $("<button>")
      .attr({
        class: "btn btn-mdb-color band-button",
        "data-name": bands[i],
        "data-toggle": "modal",
        "data-target": "#band-modal"
      })
      .text(bands[i]);
    $("#buttons-section").append(newButton);
  }
}
