/*
Day 3: 
  - delete key/value & delete entire cache
  - display entire playlist in sep div beneath


*/


// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();
var playlist = {};

const getSongsByArtist = () => {
  // Clear tracklist div
  document.getElementById('trackList').innerHTML = "";

  // Get searched artist value in input field typed in by user
  const searchedArtist = document.getElementById('artist').value

  // Uppercase first letter of artist name
  const caseFormattedSearch = searchedArtist.charAt(0).toUpperCase() + searchedArtist.slice(1)

  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + caseFormattedSearch + '&api_key=01d67fa8b4f33dce213f0c366ed33511&format=json', true);
  
  request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  console.log(`What is the data returned from the API? : `, data)

  data.toptracks.track.forEach((currTrack) => {
    if(!currTrack.mbid) {
      return;
    }
      const node = document.createElement("div")
      // Create image element and append to div
      var imgElement = document.createElement("img")
      imgElement.setAttribute("src", currTrack.image[1]['#text']);
      node.appendChild(imgElement)
      // Create artist text and append to div
      const text = document.createTextNode(caseFormattedSearch + ' - ' + currTrack.name) 
      node.appendChild(text)
      var addBtn = document.createElement("button")
      addBtn.innerText = 'Add Song';
      //click event to add songs to playlist
      $(addBtn).on("click", function() {
          playlist[currTrack.mbid] = {songArtist: currTrack.artist.name, songName: currTrack.name}
          console.log(`current playlist`, playlist)
      })
  //store     
  $(".save-it").on("click", function() {
    localStorage.setItem('playlist1', JSON.stringify(playlist));
  })
      node.appendChild(addBtn)
      document.getElementById("trackList").appendChild(node)
    })
  }
  // Send request
  request.send();
}

$(document).ready(function(){
  //store     
  // $(".save-it").on("click", function() {
  //   localStorage.setItem('playlist1', JSON.stringify(playlist));
  // })

  // Not the best way to do this, but this code adds a listener so when you press enter key (keyCode - 13),
  //  it executes the function that the 'Search' button executes. This works for now but I would find a 
  //  better way to do this if you have time.
  document.getElementById("artist")
      .addEventListener("keyup", function(event){
      // Cancel the default action, if needed
    event.preventDefault();
      if (event.keyCode === 13) {
          getSongsByArtist()
      }



  });

  // console.log("before\n", window.localStorage);


  // // let curKeyValue  = $("#artist").val()
  // // let curTextValue = $("#song-title").val()
  // var playlist = {};


  // //create text box to accept dynamic title of playlist
  // $('h1').append('<span>Title of playlist...</span>');


  // // add event listener
  // $(".add-it").on("click", function(){
  //   //to store artist-song properties

  //   //clear playlist
  //   // $(".show-playlist").empty();

  //   let curKeyValue  = $("#artist").val()
  //   let curTextValue = $("#song-title").val()


  //   if(curKeyValue === '') {
  //     alert('Please enter artist name')
  //   } else {
  //     //clear values of text boxes after 'add'
  //     $("#artist").val('')
  //     $("#song-title").val('')

  //     storeKeys.push(curKeyValue)
  //     storeValues.push(curTextValue)
  //     console.log(`key array is`,storeKeys)
  //     console.log(`value array is`,storeValues)

  //     localStorage.setItem(curKeyValue, JSON.stringify(curTextValue));
  //     let $playlistdiv = $('<div class="playlist">');
  //     $showPlaylist.html(
  //       '<span class="artist-name">' + curKeyValue + ' - </span>' + 
  //       '<span class="song-title">' + curTextValue + '</span>' 
  //     );
  //     $(".show-playlist").append($entirePlaylist);
  //   }
  // });

  // //click on artist name
  // // $(...).on("click", "#artist-name", function(clickArtist) {
  // //   $(clickArtist.target).html()

  // // });

  // // remove single item from playlist
  // $(".delete-song-btn").on("click", function() {
  //   localStorage.removeItem($("#song-title").val()); //removes key and value
  // })

  // //clears entire playlist
  // // listen for click event (del)
  // $(".clear-cache-btn").on("click", function(){
  //   alert('Are you sure you want to clear playlist?')
  //   // clear local storage
  //   localStorage.clear();
  //   $(".show-playlist").empty(); //not only child elements, but also any text within the set of matched elements
  // });

});