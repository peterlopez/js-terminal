/**
 * Initializes a new terminal object with options
 * @constructor
 * @param $display (jQuery object) element which displays result of a command
 * @param $input (jQuery object) element which recieves input via keyboard
 */
var Terminal = function($display, $input) {
   this.$display = $display;
   this.$input = $input;
};

Terminal.prototype = Object.create(Terminal.prototype);
Terminal.prototype.constructor = Terminal;
