(function() {

  var player;
  
  function log(message) {
    $('#log').append('<li>' + message + '</li>');
  }
  
  // Called automatically when the YouTube iframe API is available.
  window.onYouTubePlayerAPIReady = function() {
    player = new YT.Player('playlist-player', {
      height: 360,
      width: 640,
      playerVars: {
        // You must specify an initial playlist here due to a bug in the player.
        // If you don't specify an initial playlist, the player will never load
        // the thumbnails of all the other videos in the series.
        list: 'PLfGIEp_nCK9S1vPxIg1uxHCj3gScHET6r'
      },
      events: {
        onReady: function(event) {
          $('.needs-api').removeAttr('disabled');
        },
        
        onStateChange: function(event) {
          switch (event.data) {
            case YT.PlayerState.PLAYING:
              // Populate the playlist-index select menu if it hasn't been yet for this playlist.
              if ($('#playlist-index').children().length == 0) {
                var playlistSize = player.getPlaylist().length;
                for (var i = 0; i < playlistSize; i++) {
                  $('#playlist-index').append('<option>' + i + '</option>');
                }
              }
              
              // Set the selected index of the playlist-index menu to the current playlist index.
              var currentIndex = player.getPlaylistIndex();
              $('#playlist-index').val(player.getPlaylistIndex());
              
              $('.needs-player').removeAttr('disabled');
            break;
            
            case YT.PlayerState.ENDED:
              $('.needs-player').attr('disabled', true);
            break;
          }
        },
        
        onPlaybackQualityChange: function(event) {
          // The player should be resized to match the new quality level. Otherwise, the benefit of
          // increasing the quality level is lost, as the video would just be downsampled at
          // playback time to fit into the small player.
          var qualityLevel = event.data;
          var newHeight = qualityLevelToHeight[qualityLevel] || 360;
          var newWidth = Math.floor(newHeight * 16 / 9);
          $('#playlist-player').css({ width: newWidth, height: newHeight });
        },
        
        onError: function(event) {
           log('Error: ' + event.data);
        }
      }
    });
  }

  // On load.
  $(function() {
    // Disable all UI controls that rely on the Player API until it's available.
    $('.needs-api').attr('disabled', true);
    
    // Disable all UI controls that rely on an actively playing playlist until it's available.
    $('.needs-player').attr('disabled', true);
    
    // Load the Player API. window.onYouTubePlayerAPIReady will be invoked when it's loaded.
    $.getScript('//www.youtube.com/player_api');
    
    // Populate the list-id input element with the corresponding id from the selected option.
    // HTML5 data attributes are used to maintain the mapping.
    $('#list-id').val($('#list-type option:selected').data('list-id'));
    $('#list-type').change(function() {
      $('#list-id').val($('#list-type option:selected').data('list-id'));
    });
    
    $('#load').click(function() {
      var listType = $('#list-type option:selected').val();
      var listId = $('#list-id').val();
      
      $('#playlist-index').empty();
      player.loadPlaylist({ listType: listType, list: listId });
    });
    
    $('#loop').click(function() {
      player.setLoop($(this).is(':checked'));
    });
    
    $('#shuffle-order').click(function() {
      player.setShuffle(true);
    });
    
    $('#restore-order').click(function() {
      player.setShuffle(false);
    });
    
    $('#previous').click(function() {
      player.previousVideo();
    });
    
    $('#next').click(function() {
      player.nextVideo();
    });
    
    $('#playlist-index').change(function() {
      var newIndex = $('#playlist-index option:selected').text();
      player.playVideoAt(newIndex);
    });
  });
})();