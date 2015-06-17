/* Line stopping example */
var lineExample =
        "<xml>" +
                "<block type='controls_if' x='25' y='25'>" +
                        "<mutation else='1'></mutation>" +
                        "<value name='IF0'>" +
                                "<block type='sumorobot_line'></block>" +
                        "</value>" +
                        "<statement name='DO0'>" +
                                "<block type='sumorobot_move'></block>" +
                        "</statement>" +
                        "<statement name='ELSE'>" +
                                "<block type='sumorobot_move'></block>" +
                        "</statement>" +
                "</block>" +
        "</xml>";

/* Enemy attacking example */
var enemyExample =
        "<xml>" +
                "<block type='controls_if' x='25' y='25'>" +
                        "<mutation else='1'></mutation>" +
                        "<value name='IF0'>" +
                                "<block type='sumorobot_enemy'></block>" +
                        "</value>" +
                        "<statement name='DO0'>" +
                                "<block type='sumorobot_move'></block>" +
                        "</statement>" +
                        "<statement name='ELSE'>" +
                                "<block type='sumorobot_move'></block>" +
                        "</statement>" +
                "</block>" +
        "</xml>";

/* The socket object */
var socket = null;

/* When code has changed */
var onCodeChanged = function onCodeChanged() {
	$('#arduino-code').val(Blockly.Arduino.workspaceToCode());
};

/* Example code snippets */
var showExample = function showExample(exampleXML) {
	Blockly.mainWorkspace.clear();
	var xml = Blockly.Xml.textToDom(exampleXML);
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/* Send the code */
var sendCode = function sendCode() {
	$('#upload').attr('disabled', 'disabled');
	$('#upload').html('Uploading...');
	socket.emit('send-sumorobot-code', Blockly.Arduino.workspaceToCode());
};

/* Get a users code */
var getCode = function getCode(user) {
	socket.emit('get-sumorobot-code', user);
};

/* Show the code */
var showCode = function showCode() {
	alert(Blockly.Arduino.workspaceToCode());
};

/* When DOM has been loaded */
window.onload = function() {
	/* Initialize blockly */
	Blockly.inject(document.getElementById('blockly-div'), {
		trashcan: true,
		path: '/js/blockly/',
		toolbox: document.getElementById('toolbox')
	});
	Blockly.addChangeListener(onCodeChanged);

	/* Initialize sockets */
	socket = io.connect();

	/* Receive messages */
	socket.on('sumorobot-message', function(message) {
		$('#upload').html('Upload code');
		$('#upload').removeAttr('disabled');
	});
}

/* When keydown on document */
$(document).keydown(function(e) {
	var tag = e.target.tagName.toLowerCase();
	/* Check the key code */
	switch(e.which) {
		case 38:
			if (tag != 'input' && tag != 'textarea') /* UP */;
			break;
		case 40:
			if (tag != 'input' && tag != 'textarea') /* DOWN */;
			break;
		case 37:
			if (tag != 'input' && tag != 'textarea') /* LEFT */;
			break;
		case 39:
			if (tag != 'input' && tag != 'textarea') /* RIGHT */;
			break;
		case 69:
			if (tag != 'input' && tag != 'textarea') showExample(enemyExample);
			break;
		case 76:
			if (tag != 'input' && tag != 'textarea') showExample(lineExample);
			break;
		case 85:
			if (tag != 'input' && tag != 'textarea') sendCode();
			break;
	}
});