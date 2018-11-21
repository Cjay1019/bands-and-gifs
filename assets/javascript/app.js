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

// NEW BUTTON CLICK HANDLER ADDS USER'S NEW BAND
$("#add-band-button").on("click", function(e) {
  e.preventDefault();
  var newBand = $("#new-band-input").val();
  bands.push(newBand);
  printButtons();
});

// PRINTS BANDS ARRAY AS BUTTONS
function printButtons() {
  $("#buttons-section").empty();
  for (i = 0; i < bands.length; i++) {
    var newButton = $("<button>")
      .attr({
        class: "btn btn-primary",
        "data-name": bands[i]
      })
      .text(bands[i]);
    $("#buttons-section").append(newButton);
  }
}

printButtons();
