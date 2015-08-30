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
      if(! Mobile.isMobile()) {
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
