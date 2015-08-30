/*
*  commands.js
*  Functions for on iMac
*  -----------------------------------------------
*/
var Command = 
{
   
   /**
   * Go to a specific section of a page
   *
   * @param  jQuery selector for section of page
   * @param  URL to go to. If null, don't go anywhere
   * @return 
   */
   goTo: function(pageRegion, url)
   {
      if( url !== null && url !== "" && url !== undefined ) {
         window.location = url;
      }
      // Scroll page to section   
      if($(name).length > 0) {
         setTimeout(function() {
            $("html, body").animate({
               scrollTop: $(elID).offset().top - 100
            }, 1000);
         }, 500);
         
         return "Taking you to <span class='highlight'>"+pageRegion+"</span>..";
      }
      else {
         return "Cannot find <span class='highlight'>"+pageRegion+"</span>..";
      }
      
      success = true;
   },
   
   /**
   * Load and play a song
   *
   * @param  filepath to song (within files dir)
   * @return output from result of song loading
   */
   playSong: function(song)
   {
      var fileName = "http://phpete.me/sites/default/files/"+song+'.mp3';
      
      // If song loaded, just play it
      if(iMac.audioLoaded) {         
         iMac.playAudio(iMac.audioEl());
         return true;
      }
      
      // Load song
      $(iMac.audioEl(fileName)).load(fileName, function(response, status, xhr) {
         if ( status == "error" ) {
            iMac.update("Cannot find song '"+song+"'", null);
            iMac.audioLoaded = false;
         }
         // Display error message
         else {
            iMac.update("Playing "+song+"..", null);
            iMac.playAudio(iMac.audioEl());
            iMac.audioLoaded = true;
         }
      });
   },
};
