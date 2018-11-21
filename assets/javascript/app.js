// FIND A WAY TO MAKE THEM BAND SPECIFIC
// TOP RESULTS INSTEAD OF RANDOM

var bands = [
  "Weezer",
  "Kanye West",
  "My Chemical Romance",
  "Paramore",
  "Childish Gambino",
  "Say Anything",
  "Bright Eyes",
  "Metric",
  "Rilo Kiley",
  "The Killers",
  "The Decemberists"
];

printButtons();

// NEW BUTTON CLICK HANDLER ADDS USER'S NEW BAND
$("#add-band-button").on("click", function(e) {
  e.preventDefault();
  var newBand = $("#new-band-input").val();
  bands.push(newBand);
  printButtons();
});

$("#gifs-section").on("click", ".band-images", onOFF);

$("#buttons-section").on("click", ".band-button", printGifs);

function printGifs() {
  var currentBand = $(this).attr("data-name");
  var queryURL =
    "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" +
    currentBand;

  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var stillURL = response.data.images.fixed_height_still.url;
    var loopURL = response.data.images.fixed_height.url;
    var bandImage = $("<img>").attr({
      src: stillURL,
      alt: "band image",
      "data-state": "still",
      "data-still": stillURL,
      "data-loop": loopURL,
      class: "band-images"
    });
    $("#gifs-section").prepend(bandImage);
  });
}

function onOFF() {
  var currentState = $(this).attr("data-state");
  var currentLoopURL = $(this).attr("data-loop");
  var currentStillURL = $(this).attr("data-still");
  if (currentState === "still") {
    $(this).attr({ "data-state": "loop", src: currentLoopURL });
  } else {
    $(this).attr({ "data-state": "still", src: currentStillURL });
  }
}

// PRINTS BANDS ARRAY AS BUTTONS
function printButtons() {
  $("#buttons-section").empty();
  for (i = 0; i < bands.length; i++) {
    var newButton = $("<button>")
      .attr({
        class: "btn btn-primary band-button",
        "data-name": bands[i]
      })
      .text(bands[i]);
    $("#buttons-section").append(newButton);
  }
}
