/* jshint ignore:start */
(function ($) {
/* jshint ignore:end */

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

/*
*  events.js
*  List of all event handlers used on iMac
*  -----------------------------------------------
*/
var Events = 
{
   clicks: [],
   
   /**
   * Click event handlers for desktop devices
   * @return array of jQuery .click() handlers
   */
   desktopClicks: function()
   {   
      Events.clicks[0] = function() {
         // Unbind this event and bind the next
         $(iMac.image).unbind("click");
         iMac.currentClick += 1;

         if(iMac.currentClick < Events.clicks.length) {
            $(iMac.image).bind("click", Events.clicks[ iMac.currentClick ]);
         }
         
         // Update screen
         iMac.aboveOutput = 
            "[login]"+"<br />"+
            "type <i>help</i> for instructions"+"<br />";
         iMac.update();
         iMac.focusCursor();
      };
      Events.clicks[1] = function(e) {
         // Don't move cursor to end of input if user clicks inside input
         if( $(e.target).hasClass("input") ) {
            return false;
         }
         iMac.focusCursor();
      };
      
      return Events.clicks;
   },
   
   /*
   * Event handlers for key press
   *
   * @return object containing jQuery .keydown() handlers
   *         format: eventsList: { jQuery-selector: .keydown(function() { }) }
   */
   keyboardEvents: function()
   {
      var events = {};
      events[iMac.input] = function(e) {
         // Check for action keys like "enter" and "up arrow"
         switch(e.keyCode)
         {
            // "Enter" or return key
            case 13:
               iMac.currentLine = $(iMac.input).text().trim();
               var command = iMac.currentLine;
               
               var success = iMac.processCommand(command);
               if(success) {
                  iMac.commandsList.push(command);
               }
               else {
                  iMac.aboveOutput = "Unrecognized command, try again or"+"<br />"+
                                     "type <span class='highlight'>help</span> for options"+"<br />";
                  iMac.update();
               }
               iMac.focusCursor();
               
               return false;
            
            // "Up" arrow key
            case 38:
               // Get previous command from list
               var prevCommand = iMac.commandsList[ iMac.commandsList.length-1 ];
               if(prevCommand === undefined) {
                  return false;
               }
               // Update display
               iMac.aboveOutput = iMac.beginCommandStr+prevCommand;
               iMac.currentLine = prevCommand;
               iMac.update();
               break;
         }
      };
      
      return events;
   },
   
   /*
   * Click (tap) event handlers for mobile devices
   * @return array of jQuery .click() and .tap() handlers
   */
   mobileClicks: function()
   {
      var clicks = [];
      // TODO
      return clicks;
   },
};

/*
*  iMac.js
*  Interactive terminal screen on homepage iMac
*  -----------------------------------------------
*/
var iMac = 
{
   // All successful commands listed here
   commandsList: [],
   
   // Settings
   clientScreen:     "",
   currentClick:     0,
   deviceDependentText: "",
   initalized:       false,
   audioLoaded:      false,
   
   // jQuery selectors
   image:            ".iMac-img, #iMac .terminal",
   input:            "#iMac .terminal .input",
   terminal:         "#iMac .terminal",
   audioElement:     "#audio",
   aboveOutput:      "",
   currentLine:      "",
   
   // Text presets
   availableCommands:"<span class='highlight'>clear</span> - Clear output"+"<br />"+
                     "<span class='highlight'>help</span> - Display all available commands"+"<br />"+
                     "<span class='highlight'>play song</span> - I'll play a song on the piano"+"<br />"+
                     "<span class='highlight'>project [#]</span> - Go to a project where [#] is the project ID"+"<br />"+
                     "<span class='highlight'>shutdown</span> - sign off this site"+"<br />",
   beginCommandStr:  "<span class='begin-command'>$&nbsp;</span>",
   greeting:         this.beginCommandStr+" print greeting();"+"<br />"+
                     "Hello, World!"+"<br />"+
                     "Welcome to <span class='highlight'>JS Terminal</span>"+"<br><br>"+
                     "This is a fully customizable, interactive terminal"+"<br>"+
                     "<span class='highlight'>click me!</span>",
   /**
   * @property DOM element where audio is loaded
   */
   audioEl: function(path) {
      path = path === undefined || path === null ? "" : path;
      
      var element = null;
      var elementID = iMac.audioElement;
      
      // Create new element
      if( $(elementID).length === 0 ) {
         element = document.createElement('audio');
         element.setAttribute('src', path);
         element.setAttribute('autoplay', 'autoplay');
      }
      // Get existing audio
      else {
         element = $(elementID).get(0);
      }
      
      return element;
   },
   
   /**
   * Starting point of execution
   */
   init: function()
   {
      iMac.initDeviceSpecificSettings();
      iMac.registerEvents();
      
      iMac.initalized = true;
   },
   
   /**
   * Setup object properties
   */
   initDeviceSpecificSettings: function()
   {
      if(true) { //! Mobile.isMobile()
         iMac.clientScreen = "desktop";
         $(iMac.terminal).css('cursor', 'pointer');
         
         iMac.deviceDependentText = "This is my iMac, you can"+"<br />"+
                                    "interact with it by clicking on it";
      }
   },
   
   /**
   * Moves text cursor to end of terminal input text
   */
   focusCursor: function()
   {
      var input = $(iMac.input)[0];

      var range, selection;
      range = document.createRange();     //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(input);    //Select the entire contents of the element with the range
      range.collapse(false);              //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection();  //get the selection object (allows you to change selection)
      selection.removeAllRanges();        //remove any selections already made
      selection.addRange(range);          //make the range you have just created the visible selection
      
      input.focus();
   },
   
   /**
   * Processes input from command line and
   * dispatches action if needed
   *
   * @return success - boolean 
   */
   processCommand: function(input)
   {
      // Assume command is valid until not recognized
      var success = true;
      // iMac aboveOutput to be displayed (if set)
      var output = null;
      
      // Check input
      input = input.trim();
      if(input === "") {
         return false;
      }
      
      switch(true)
      {   
         case /clear/.test(input):            
            output = "";
         break;
         
         case /help/.test(input):
            output = "Available commands:"+"<br />"+
                     iMac.availableCommands;
            break;
            
         case /play\s+[a-z0-9]([a-z0-9]|\-)+/.test(input):
            // Get input after "play "
            var song = input.split("play ")[1].toLowerCase();
            
            Command.playSong(song);
            break;
      
         case /project\s+[0-9]+/.test(input):
            var pageRegion = input;
            pageRegion = "#"+input.replace(/\s/g, "-");
            
            // Go to section of page
            output = Command.goTo(pageRegion, null);
            break;
      
         case /shutdown/.test(input):
            $("body").html("<h4 class='shutdown-title'>Goodbye.</h4><p class='shutdown-txt'>Click anywhere to go back.</p>");
            $("html").addClass("black").css('cursor', 'pointer');
            $("html").click(function() {
               window.location.reload();
            });
            break;
         
         default:
            success = false;
            break;
      }
      
      // Erase input
      if(success) {      
         iMac.currentLine = "";
      }
      
      // Update display with output
      if(output !== null) {
         iMac.aboveOutput = output;
         iMac.update();
      }
      
      return success;
   },
   
   /*
   * Plays given <audio>
   * @param DOM element of audio interface
   */
   playAudio: function(audio)
   {
      if( $(audio).length === 0 ) {
         return false;
      }
      audio.play();
      
      return true;
   },
   
   /*
   * Gather and bind all event handlers on iMac
   */
   registerEvents: function()
   {
      var clicks = [];
      var keyboard = {};
      
      // Enable terminal interaction
      if(iMac.clientScreen == "desktop") {
         clicks = Events.desktopClicks();
         keyboard = Events.keyboardEvents();
      }
      // Enable simple interaction on mobile devices (one tap)
      if(iMac.clientScreen == "mobile") {
         clicks = Events.mobileClicks();
      }
      
      // Bind first click handler in array
      if(clicks.length > 0) {
         $(iMac.image).bind("click", clicks[0]);
      }
      // Bind associative array of keyboard events
      $(iMac.terminal).bind("contentchanged", function() {
         for(var el in keyboard) {
            $(el).on("keydown", keyboard[el]);
         }
      });
   },
   
   /*
   * Refreshes contents of terminal window text
   *
   * @param optional, string of html to be placed above current input
   * @param optional, string of text to be placed in contentEditible region
   */
   update: function(aboveOutput, currentLine)
   {
      // Set output to current content if not given
      aboveOutput = aboveOutput === undefined || aboveOutput === null ? iMac.aboveOutput : aboveOutput;
      currentLine = currentLine === undefined || currentLine === null ? iMac.currentLine : currentLine;

      // Assemble currentLine
      var html = iMac.beginCommandStr+" <p class='input' contenteditable='true'>"+ currentLine +"</p>";
      // don't show beginCommandStr initally
      if(! iMac.initalized) {
         html = "<p class='input' onfocus='this.value = this.value;' contenteditable='true'>"+currentLine+"</p>";
      }
      // Assemble currentLine below aboveOutput
      html = "<p class='above-output'>"+aboveOutput+"</p>"+html;
      
      $(iMac.terminal).html(html);
      $(iMac.terminal).trigger("contentchanged");
   },
};

$(document).ready(function() {
   iMac.init();
});

/* jshint ignore:start */

})(jQuery);
/* jshint ignore:end */
