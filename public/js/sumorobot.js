/* When code has changed */
var onCodeChanged = function onCodeChanged() {
	$('#arduino-code').val(Blockly.Arduino.workspaceToCode());
}

/* Send the code */
function sendCode() {
	socket.emit('send-sumorobot-code', Blockly.Arduino.workspaceToCode());
}

/* Get a users code */
function getCode(userEmail) {
	socket.emit('get-code', 'sumorobot', userEmail);
}

/* Show the code */
function showCode() {
	alert(Blockly.Arduino.workspaceToCode());
}

/* When DOM has been loaded */
window.onload = function() {
	// initialize blockly
	Blockly.inject(document.getElementById('blockly-div'), {
		scrollbars: false,
		path: '/js/blockly/',
		toolbox: document.getElementById('toolbox')
	});
	Blockly.addChangeListener(onCodeChanged);
}