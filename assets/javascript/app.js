//VARIABLES

var topics = ["cats", "dogs", "critical role"]

var buttonAreaHTML = $("#button-area")
var resultAreaHTML = $("#result-area")

var currentOffset = 0
var currentTopic = ""

//========================================================================================
//FUNCTIONS

function getGiphyLink(search, offset) {
  //takes a search term string and a number offset
  //returns a string, the url for the particular giphy API call
  var giphyKey = "O4pAT7bGoyGuNqyOq9ANliHcO7NJ8gdi"

  var giphyLink = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyKey + "&q=" + search + "&offset=" + offset + "&limit=10"

  return giphyLink
}


function renderButtons() {
  // Deleting the buttons prior to adding new items
  buttonAreaHTML.empty();

  // Looping through the array of topics
  for (var i = 0; i < topics.length; i++) {
    // Then generate buttons for each topic in the array
    var newBtn = $("<button>");
    // Add classes; search btn for searching later, and other classes for just generally making things look nice.
    newBtn.addClass("search-btn m-3 btn btn-outline-primary");
    // Adding a data-attribute
    newBtn.attr("data-name", topics[i]);
    // Providing the initial button text
    newBtn.text(topics[i]);
    // Adding the button to the buttons-view div
    buttonAreaHTML.append(newBtn);
  }
}

function searchGifs() {
  searchTopic = $(this).attr("data-name")
  // If the current active topic is the same as the one clicked, then just don't do anything.
  if (searchTopic === currentTopic) {
    return false;
  };

  // set the current topic to the one clicked
  currentTopic = searchTopic;

  // set the curret offset back to 0, in case it's been brough up by something else
  currentOffset = 0;

  // empty out the results area
  resultAreaHTML.empty()

  queryURL = getGiphyLink(currentTopic, currentOffset)

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    writeGifs(response.data)
  })

  // since I don't want the add more button on the page at the beginning,
  // we'll empty the add-more div and remake the button every time we change to a new topic
  $("#add-more").empty();
  var addBtn = $("<i>");
  addBtn.addClass("addMore far fa-plus-square");
  $("#add-more").append(addBtn)
}

function writeGifs(data) {
  // takes an array of objects, specifically the "data" array of a giphy API response
  // loop over the array
  for (i = 0; i < data.length; i++) {
    //make a div for the new gif
    var gifDiv = $("<div>")
    gifDiv.addClass("col-12 col-sm-6 col-md-4 mb-3")

    // make a new image
    var newGif = $("<img>")
    // add the image URL and some classes to the image
    newGif
      .attr({
        "src": data[i].images.fixed_height_still.url,
        "data-still": data[i].images.fixed_height_still.url,
        "data-animate": data[i].images.fixed_height.url,
      })
      .addClass("gif")
    //write the gif to the new div
    gifDiv.append(newGif)

    //make a div for the gif information
    var gifInfo = $("<div>")
    gifInfo.addClass("")
    
    //get the gif's rating
    var gifRating = $("<span>")
    gifRating
      .addClass("")
      .text("Rating: " + data[i].rating.toUpperCase())

    //add name and rating to the information div
    gifInfo.append(gifRating)

    //add info to the gif div
    gifDiv.append(gifInfo)


    //write the new div to the gif area
    resultAreaHTML.append(gifDiv)
  }
}

function addGifs() {
  // In order to add more gifs of the same search, increase the offset by 10
  currentOffset += 10;

  // Run the api call

  queryURL = getGiphyLink(currentTopic, currentOffset)

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    writeGifs(response.data)
  })
}

function gifClick() {
  var state = $(this).attr("data-state")

  // check what state is set to

  // if still,
  // update the src attribute to it's data-animate value,
  // and update the data-state attribute to 'animate'.
  if (state === "still") {
    $(this).attr("data-state", "animate")
    $(this).attr("src", $(this).attr("data-animate"))
  }

  // If  'animate', then update the src attribute to data-still value
  // and update the data-state attribute to 'still'
  else {
    $(this).attr("data-state", "still")
    $(this).attr("src", $(this).attr("data-still"))
  }
}
//========================================================================================
// BUTTONS

$("#add-search").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var newItem = $("#search-input").val().trim();
  $("#search-input").val("");

  // Adding search term from the textbox to our array
  topics.push(newItem);

  // Calling renderButtons which handles the processing of our topics array
  renderButtons();
});


// The following event listeners are done using the $(document) selector
// so that they apply even as more elements are added

// Adding a click event listener to all elements with a class of "search-btn"
$(document).on("click", ".search-btn", searchGifs);

// Adding a click event listener to all elements with a class of "addMore"
$(document).on("click", ".addMore", addGifs)

// Adding a click listener to all elements with a class of "gif"
$(document).on("click", ".gif", gifClick)

//========================================================================================
// PAGE CODE


renderButtons()