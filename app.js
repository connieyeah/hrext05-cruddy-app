/*
After localStorage is cleared -> go to create new playlist

Edit playlist name -> edit key in localStorage

*/

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();
var keyValue; //key for localStorage
var playlist = {}; //property to be stored in localStorage

var getSongsByArtist = function() {
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

  data.toptracks.track.forEach(function(currTrack){
    if(!currTrack.mbid) {
      return 'song not available to add';
    }

      var node = $("<div id='trackDiv' data=" + currTrack.mbid + "></div>")
      node.data(`dude`)
      // Create image element and append to div
      var imgElement = document.createElement("img")
      imgElement.setAttribute("src", currTrack.image[1]['#text']);
      node.append(imgElement)
      // Create artist text and append to div
      var text = document.createTextNode(caseFormattedSearch + ' - ' + currTrack.name) 
      node.append(text)
      var addBtn = document.createElement("button")
      addBtn.innerText = 'Add Song';
      // click event to add songs to playlist & save to localStorage
      $(addBtn).on("click", function() {
        if (!playlist[currTrack.mbid]) {
          playlist[currTrack.mbid] = {songArtist: currTrack.artist.name, songName: currTrack.name, mbid: currTrack.mbid}
          console.log(`current playlist`, playlist)
          localStorage.setItem(keyValue, JSON.stringify(playlist));
        } else {
          alert('song already exists in playlist')
        }
      })

      node.append(addBtn)
      $("#trackList").append(node)
    })
  }
  // Send request
  request.send(); 
}


$(document).ready(function(){

  var $forTitle = $('.forTitle');
  var $forSearch = $('.forSearch');
  var $forTracks = $('.forTracks')
  var $forPlaylist = $('.forPlaylist');
  var $body = $('body');
  var $h1 = $('h1');


  if(window.localStorage.length === 0){
    $forTitle.show()
    $forSearch.hide()
    $forTracks.hide()
    $forPlaylist.hide()
  } else {
    $forTitle.hide()
  }

  // console.log(window.localStorage)


//to format key for localStorage
function createKey(key){
  return key.replace(/[^a-zA-Z0-9]/g, '');
}


$('#titleBtn').on("click", function(){
  // if (!$('#titlePlaylist').val()) {
  //   alert('Enter playlist title!')
  // } else {
    keyValue = createKey($('#titlePlaylist').val());
    $h1.text($('#titlePlaylist').val())
  // }
  localStorage.setItem(keyValue, JSON.stringify(playlist))
  $forTitle.empty()
  $forSearch.show()
  $forTracks.show()
  $forPlaylist.show()
})

  // Not the best way to do this, but this code adds a listener so when you press enter key (keyCode - 13),
  //  it executes the function that the 'Search' button executes. 
  document.getElementById("artist")
      .addEventListener("keyup", function(event){
      // Cancel the default action, if needed
    event.preventDefault();
      if (event.keyCode === 13) {
          getSongsByArtist()
      }
  });

  //code for collapsible
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

// console.log(`this is localStorage:`,window.localStorage)

// to display current playlist
$(".collapsible").on("click", function() {
  //clear so code beneath does not keep appending to repeating localStorage
  $(".show-playlist").empty();

  var list;

  list = JSON.parse(localStorage.getItem(keyValue));

  var $myPlaylist = $('<div class="playlist">');
    
  //defined before it's called or else function undefined due to hoisting (es5)
  function toDelete(key) {
    console.log(`ATTEMPTING TO DELETE: `, key)
    // console.log(`before playlist`, playlist)
    if (playlist[key]) {
      delete playlist[key];
    }
    //updates changes in localStorage
    localStorage.setItem(keyValue, JSON.stringify(playlist))
    //updates collapsible playlist
    $("#"+key).remove()
    // console.log(`after playlist`, playlist)
  }

  //populate collapsible
  for (var key in list) {
    var artistSong = list[key];
    console.log(`unique mbid: `,artistSong.mbid)
    //parent element
    var $playlistRow = $("<div class='playlist-row' id=" + artistSong.mbid + " data=" + artistSong.mbid + ">")
    var $songItem = $('<div><span class="songArtist">' + artistSong.songArtist + ' - </span>' +
      '<span class="songName">' + artistSong.songName + '</span></div>')
    
    //create delete button to append per row
    var deleteBtn = $("<button id=" + artistSong.mbid + " type='button'>Delete</button>")
    
    $(deleteBtn).on("click", function(e){
      var songId = e.target.id
      toDelete(songId)
    })

    $songItem.append(deleteBtn)
    $playlistRow.append($songItem)  
    $myPlaylist.append($playlistRow);
  }

  $(".show-playlist").append($myPlaylist)  

});




// $("#formButton").click(function(){
//         $("#form1").toggle();
//     });

// //rename key in localStorage
// $("#rename-playlist-btn").on("click", function(){
//   $("#rename-key").toggle();
//     var newKey = $(this).data
// });

// $(".clear-all-songs").on("click", function() {
//   alert('Are you sure you want to delete all songs from playlist?')
//   localStorage.removeItem(keyValue)
//   $(".show-playlist").empty();
// })


//clears localStorage (playlist)
$(".clear-cache-btn").on("click", function(){
// alert('Are you sure you want to delete playlist?')
  // localStorage.removeItem(keyValue)
  localStorage.clear();
  $(".show-playlist").empty(); //not only child elements, but also any text within the set of matched elements
});

});