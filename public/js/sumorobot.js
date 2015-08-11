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

/* Sumorobot code */
var sumorobotPreCode = "#include <Servo.h>\n#include <Sumorobot.h>\n\nSumorobot sumorobot;\n\nvoid setup() {\n}\n\nvoid loop() {\n";
var sumorobotPostCode = "}";

/* To check if local browser storage is available */
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

/* When code has changed */
var onCodeChanged = function onCodeChanged() {
	var intendedCode = Blockly.JavaScript.workspaceToCode().replace(/\n/g, "\n  ").slice(0, -2);
	if (intendedCode.length > 0) intendedCode = "  " + intendedCode;
	$('#sumorobot-code').val(sumorobotPreCode + intendedCode + sumorobotPostCode);
	/* When local storage available */
    if (supportsLocalStorage) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        localStorage['sumorobot.currentProgram'] = Blockly.Xml.domToText(xml);
    }
};

/* Toggle textual and graphical mode */
var toggleCodingMode = function toggleCodingMode() {
	$('#blockly-div').toggle();
	$('#sumorobot-code').prop('readonly', !$('#sumorobot-code').prop('readonly'));
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
	socket.emit('send-sumorobot-code', Blockly.JavaScript.workspaceToCode());
};

/* Get a users code */
var getCode = function getCode(user) {
	socket.emit('get-sumorobot-code', user);
};

/* Show the code */
var showCode = function showCode() {
	alert(Blockly.JavaScript.workspaceToCode());
};

/* When DOM has been loaded */
window.onload = function() {
	/* add setting full hsv range functionality */
	Blockly.Block.prototype.setHSV = function(a, b, c) {
		this.colourHue_ = a;
		this.colourSaturation_ = b;
		this.colourValue_ = c;
		this.rendered&&this.updateColour()
	};
	Blockly.BlockSvg.prototype.updateColour = function(){
		if (!this.disabled) {
			if (this.colourHue_ == 210) {
				this.colourHue_ = 80;
				this.colourSaturation_ = 1.00;
				this.colourValue_ = 255 * 0.74;
			} else if (typeof(this.colourSaturation_) === 'undefined') {
				this.colourSaturation_ = Blockly.HSV_SATURATION;
				this.colourValue_ = 255 * Blockly.HSV_VALUE;
			}
			var a = goog.color.hsvToHex(this.getColour(), this.colourSaturation_, this.colourValue_);
			var b = goog.color.hexToRgb(a);
			var c = goog.color.lighten(b,.3);
			b = goog.color.darken(b,.4);
			this.svgPathLight_.setAttribute("stroke",goog.color.rgbArrayToHex(c));
			this.svgPathDark_.setAttribute("fill",goog.color.rgbArrayToHex(b));
			this.svgPath_.setAttribute("fill",a);
			c = this.getIcons();
			for (a = 0; a < c.length; a++)
				c[a].updateColour();
			for (a = 0; c = this.inputList[a]; a++)
				for (var b = 0,d; d = c.fieldRow[b]; b++)
					d.setText(null);
			this.rendered&&this.render()
		}
	};

	/* MOVE */
	Blockly.Blocks.sumorobot_move = {
		helpUrl: 'https://codesnail.koodur.com/robokoding/',
		init: function() {
			this.setHSV(0, 1.00, 255*0.74);
			this.appendDummyInput()
				.appendField(new Blockly.FieldDropdown(this.VALUES), 'MOVE');
			this.setPreviousStatement(true);
			this.setNextStatement(true);
			this.setTooltip('move to chosen direction');
		}
	};
	Blockly.Blocks.sumorobot_move.VALUES =
		[[Blockly.Msg.CONTROLS_SUMOROBOT_FORWARD + ' \u2191', 'forward'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_BACKWARD + ' \u2193', 'backward'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_RIGHT + ' \u21BB', 'right'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_LEFT + ' \u21BA', 'left'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_STOP , 'stop']];
	Blockly.JavaScript.sumorobot_move = function() {
		var value = this.getFieldValue('MOVE');
		return 'sumorobot.' + value + '();\n';
	};

	/* DELAY */
	Blockly.Blocks.sumorobot_delay = {
		helpUrl: 'https://codesnail.koodur.com/robokoding/',
		init: function() {
			this.setHSV(210, 1.00, 255*0.74);
			this.appendDummyInput().appendField(Blockly.Msg.CONTROLS_SUMOROBOT_DELAY)
				.appendField(new Blockly.FieldTextInput('1000', Blockly.FieldTextInput.numberValidator), 'DELAY');
			this.setPreviousStatement(true);
			this.setNextStatement(true);
			this.setTooltip('continue moving to chosen direction');
		}
	};
	Blockly.JavaScript.sumorobot_delay = function() {
		var value = this.getFieldValue('DELAY');
		return 'sumorobot.delay(' + value + ');\n';
	};

	/* ENEMY */
	Blockly.Blocks.sumorobot_enemy = {
		helpUrl: 'https://codesnail.koodur.com/robokoding/',
		init: function() {
			this.setHSV(200, 1.00, 255*0.74);
			this.appendDummyInput()
				.appendField(new Blockly.FieldDropdown(this.VALUES), 'ENEMY');
			this.setOutput(true, 'Boolean');
			this.setTooltip('detect enemy');
		}
	};
	Blockly.Blocks.sumorobot_enemy.VALUES =
		[[Blockly.Msg.CONTROLS_SUMOROBOT_ENEMY_LEFT, 'LEFT'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_ENEMY_RIGHT, 'RIGHT'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_ENEMY_FRONT, 'FRONT']];
	Blockly.JavaScript.sumorobot_enemy = function() {
		var value = this.getFieldValue('ENEMY');
		return ['sumorobot.isEnemy(' + value + ')', Blockly.JavaScript.ORDER_ATOMIC];
	};

	/* LINE */
	Blockly.Blocks.sumorobot_line = {
		helpUrl: 'https://codesnail.koodur.com/robokoding/',
		init: function() {
			this.setHSV(50, 1.00, 255*0.74);
			this.appendDummyInput()
				.appendField(new Blockly.FieldDropdown(this.VALUES), 'LINE');
			this.setOutput(true, 'Boolean');
			this.setTooltip('detect line');
		}
	};
	Blockly.Blocks.sumorobot_line.VALUES =
		[[Blockly.Msg.CONTROLS_SUMOROBOT_LINE_LEFT, 'LEFT'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_LINE_RIGHT, 'RIGHT'],
		[Blockly.Msg.CONTROLS_SUMOROBOT_LINE_FRONT, 'FRONT']];
	Blockly.JavaScript.sumorobot_line = function() {
		var value = this.getFieldValue('LINE');
		return ['sumorobot.isLine(' + value + ')', Blockly.JavaScript.ORDER_ATOMIC];
	};

	/* inject Blobkly */
	Blockly.inject(document.getElementById('blockly-div'), {
		path: "/js/blockly/",
		trashcan: true,
		toolbox: '<xml id="toolbox" style="display: none;">' +
			'<block type="controls_if"></block>' +
			'<block type="sumorobot_move"><title name="MOVE">forward</title></block>' +
			'<block type="sumorobot_enemy"><title name="ENEMY">FRONT</title></block>' +
			'<block type="sumorobot_line"><title name="LINE">FRONT</title></block>' +
			'<block type="sumorobot_delay"></block></xml>'
	});
	/* When local storage available */
	if (supportsLocalStorage && localStorage['sumorobot.currentProgram']) {
		console.log(localStorage['sumorobot.currentProgram']);
		var xml = Blockly.Xml.textToDom(localStorage['sumorobot.currentProgram']);
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
	}
	/* Add a change listener to Blockly */
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