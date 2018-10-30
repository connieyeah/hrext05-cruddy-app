/*
listen for click event (edit)
update text in local storage (with key)
update display with new text value


 */

$(document).ready(function(){
  // console.log("before\n", window.localStorage);

  let $h1 = $('h1');
  let $showPlaylist = $('.show-playlist')
  // let curKeyValue  = $("#artist").val()
  // let curTextValue = $("#song-title").val()

  //Default header
  // let originalPlaylistHeader = "Create Playlist"

  //display playlist
  // function initialDisplay(playlistArr, headerText) {
  //   $h1.text(headerText)
  //   let $playlistdiv = $('<div class="playlist">');
  //   $playlistdiv.html(
  //     '<span class="artist-name">' + curKeyValue + ':</span>' + 
  //     '<span class="song-title">' + curTextValue + ':</span>' 
  //     );
  //   $playlistdiv.append($show-playlist)
  // }

  // add event listener
  $(".add-it").on("click", function(){
    //to store artist-song properties

    //clear playlist
    // $(".show-playlist").empty();
    // $(".show-playlist").children().remove();

    let curKeyValue  = $("#artist").val()
    let curTextValue = $("#song-title").val()


    if(curKeyValue === '') {
      alert('Please enter artist name')
    } else {
      //clear text boxes after 'add'
      $("#artist").val('')
      $("#song-title").val('')

      localStorage.setItem(curKeyValue, curTextValue);
      $(".show-playlist").append(curKeyValue+ ' - ' +curTextValue);
    }
  });

  //click on artist name
  // $(...).on("click", "#artist-name", function(clickArtist) {
  //   $(clickArtist.target).html()

  // });

  // remove item from app

  // listen for click event (del)
  $(".clear-cache-btn").on("click", function(){
    alert('Are you sure you want to clear playlist?')
    // clear local storage
    localStorage.clear();
    $(".show-playlist").empty(); //not only child elements, but also any text within the set of matched elements
  });

});