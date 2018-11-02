// Globals
var request = new XMLHttpRequest();
var playlistName;
var playlist;

//to format key for localStorage
function sanitizeKey(key){
  return key.replace(/[^a-zA-Z0-9]/g, '');
}

// Creates img element used in track row div
function createTrackImg(currTrack) {
  var imgElement = document.createElement("img")
  imgElement.setAttribute("src", currTrack.image[1]['#text']);
  return imgElement
}

function createTrackRow(currTrack, userInput) {
  var validId = currTrack.mbid
  // Data can possibly return a track with a MISSING MBID, so check for MBID
  if (validId) {
    var trackRow = $("<div id='trackDiv' data=" + currTrack.mbid + "></div>")
    var trackImg = createTrackImg(currTrack)
    trackRow.append(trackImg)

    var trackText = document.createTextNode(currTrack.artist.name + ' - ' + currTrack.name) 
    trackRow.append(trackText)

    var addBtn = document.createElement("button")
    addBtn.innerText = 'Add Song';
    $(addBtn).on("click", function() {
      var userInput = window.localStorage.getItem('playlistName')
      var playlist = JSON.parse(window.localStorage.getItem(userInput))
      console.log(playlist)

      if (playlist) {
        if (!playlist[currTrack.mbid]) {
           playlist[currTrack.mbid] = {songArtist: currTrack.artist.name, songName: currTrack.name, mbid: currTrack.mbid}
          localStorage.setItem(userInput, JSON.stringify(playlist));
        } else {
          alert('song already exists in playlist')
        }
      }
    })
    trackRow.append(addBtn)
    $("#trackList").append(trackRow)
  }
}

// Makes a request to API to get back artist data
function getSongsByArtist() {
  // Clear track list every time we search for a new artist
  document.getElementById('trackList').innerHTML = "";
  // Get the artist name from inout field
  const searchedArtist = document.getElementById('artist').value
  const sanitizedSearch = searchedArtist.charAt(0).toUpperCase() + searchedArtist.slice(1)
  // Opens the request to be made to the API
  request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + sanitizedSearch + '&api_key=01d67fa8b4f33dce213f0c366ed33511&format=json', true);
  // When the request is made, map over the data and create a row from each track
  request.onload = function() {
    var apiData = JSON.parse(this.response);
    console.log(`What is the data returned from the API? : `, apiData)
    apiData.toptracks.track.forEach(function(currTrack) {
      createTrackRow(currTrack)
    });
  }

  request.send()
}

// Deletes a track from saved playlist
function deleteTrack(key) {
  var playlistName = localStorage.getItem('playlistName')
  var playlist = JSON.parse(localStorage.getItem(playlistName));
  if (playlist[key]) {
    delete playlist[key];
  }
  //updates changes in localStorage
  localStorage.setItem(playlistName, JSON.stringify(playlist))
  //updates collapsible playlist
  $("#"+key).remove()
}


$(document).ready(function(){
  document.getElementById("artist").addEventListener("keyup", function(event){
    event.preventDefault();
    if (event.keyCode === 13) {
      getSongsByArtist()
    }
  });
  document.getElementById("titlePlaylist").addEventListener("keyup", function(event){
    event.preventDefault();
    if (event.keyCode === 13) {
      var userInput = sanitizeKey($('#titlePlaylist').val());
      // Set title of page to what user inputs
      $h1.text($('#titlePlaylist').val())
      // Create new playlist in localStorage with initial {}
      localStorage.setItem(userInput, JSON.stringify({}))
      localStorage.setItem('playlistName', userInput)
      $forTitle.hide()
      $forSearch.show()
      $forTracks.show()
      $forPlaylist.show()
    }
  });

  var $forTitle = $('.forTitle');
  var $forSearch = $('.forSearch');
  var $forTracks = $('.forTracks')
  var $forPlaylist = $('.forPlaylist');
  var $body = $('body');
  var $h1 = $('h1');

  var userInput = sanitizeKey($('#titlePlaylist').val());

  if(!userInput){
    $forTitle.show()
    $forSearch.hide()
    $forTracks.hide()
    $forPlaylist.hide()
  } else {
    $forTitle.hide()
  }

  $('#titleBtn').on("click", function() {
    var userInput = sanitizeKey($('#titlePlaylist').val());
    // Set title of page to what user inputs
    $h1.text($('#titlePlaylist').val())
    // Create new playlist in localStorage with initial {}
    localStorage.setItem(userInput, JSON.stringify({}))
    localStorage.setItem('playlistName', userInput)

    $forTitle.hide()
    $forSearch.show()
    $forTracks.show()
    $forPlaylist.show()
  })

  // Create collapsable
  var coll = document.getElementsByClassName("collapsible");
  for (var i = 0; i < coll.length; i++) {
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


  // to display current playlist
  $(".collapsible").on("click", function() {
    //clear so code beneath does not keep appending to repeating localStorage
    $(".show-playlist").empty();
    var playlistName = localStorage.getItem('playlistName')
    var list = JSON.parse(localStorage.getItem(playlistName));

    var $myPlaylist = $('<div class="playlist">');
    console.log(`is this running: `, list)
      
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
        deleteTrack(songId)
      })
      $songItem.append(deleteBtn)
      $playlistRow.append($songItem)  
      $myPlaylist.append($playlistRow);
    }

    $(".show-playlist").append($myPlaylist)  
  });

  // Clears localStorage (playlist)
  $(".clear-cache-btn").on("click", function(){
    var playlistName = localStorage.getItem('playlistName')
    localStorage.removeItem(playlistName)
    localStorage.removeItem('playlistName')
    $('#artist').val('')
    $('#titlePlaylist').val('')
    $forSearch.hide()
    $forTracks.hide()
    $('#trackList').empty()
    $forPlaylist.hide()
    $forTitle.show()
    $h1.text('');
    $(".show-playlist").empty(); //not only child elements, but also any text within the set of matched elements
  });

});