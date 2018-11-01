// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();
var playlist = {}; //property value to be stored in localStorage

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

  data.toptracks.track.forEach(function(currTrack){
    if(!currTrack.mbid) {
      return;
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
      //click event to add songs to playlist & save to localStorage
      $(addBtn).on("click", function() {
        if (!playlist[currTrack.mbid]) {
          playlist[currTrack.mbid] = {songArtist: currTrack.artist.name, songName: currTrack.name, mbid: currTrack.mbid}
          console.log(`current playlist`, playlist)
          localStorage.setItem('playlist1', JSON.stringify(playlist));
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

// console.log(window.localStorage)

// to display current playlist
$(".collapsible").on("click", function() {

  //clear so code beneath does not keep appending to repeating localStorage
  $(".show-playlist").empty();

  var list;

  list = JSON.parse(localStorage.getItem('playlist1'));
  // console.log(list)

    var $myPlaylist = $('<div class="playlist">');
    
    function toDelete(key) {
        console.log(`ATTEMPTING TO DELETE: `, key)
        // console.log(`before playlist`, playlist)
        if (playlist[key]) {
          delete playlist[key]
        }
        //updates changes in localStorage
        localStorage.setItem('playlist1', JSON.stringify(playlist))
        //update collapsible 
        $("#"+key).remove() // #fe664d51-b267-4e2d-8daf-d9e3f9cc8a6e
        // console.log(`after playlist`, playlist)
    }

    //populate collapsible
    for (var key in list) {
      var artistSong = list[key];
      console.log(artistSong.mbid)
      //parent element which you can delete and it will get rid of children
      var $playlistRow = $("<div class='playlist-row' id=" + artistSong.mbid + " data=" + artistSong.mbid + ">")
      //child
      var $songItem = $('<div><span class="songArtist">' + artistSong.songArtist + ' - </span>' +
        '<span class="songName">' + artistSong.songName + '</span></div>')
      

      //create delete button to append per row
      var deleteBtn = $("<button id=" + artistSong.mbid + " type='button'>Delete</button>")
      deleteBtn.click((e) => {
        var songId = e.target.id
        toDelete(songId)
      })

      

      
      $songItem.append(deleteBtn)
      $playlistRow.append($songItem)  
      $myPlaylist.append($playlistRow);
    }

    $(".show-playlist").append($myPlaylist)  


});



//clears localStorage (playlist)
$(".clear-cache-btn").on("click", function(){
    alert('Are you sure you want to clear playlist?')
    localStorage.clear();
    $(".show-playlist").empty(); //not only child elements, but also any text within the set of matched elements
  });
});