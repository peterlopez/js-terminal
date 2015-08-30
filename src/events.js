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
