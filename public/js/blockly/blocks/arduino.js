/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Arduino blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.arduino');

goog.require('Blockly.Blocks');


Blockly.Blocks['sumorobot_main'] = {
  init: function() {
    this.setColour(65);
    this.appendStatementInput("setup").appendField("SETUP");
    this.appendStatementInput("loop").appendField("LOOP");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setTooltip("");
  }
};

Blockly.Blocks['sumorobot_motor'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput().appendField('START');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("");
  }
};

Blockly.Blocks['sumorobot_move'] = {
  init: function() {
    var OPERATORS =
      [['STOP', 'stop'],
       ['FORWARD', 'forward'],
       ['BACKWARD', 'backward'],
       ['LEFT', 'left'],
       ['RIGHT', 'right']];
    this.setColour(330);
    var dropdown = new Blockly.FieldDropdown(OPERATORS);
    this.appendValueInput('NUM')
      .setCheck('Number').appendField(dropdown, 'MOVE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("");
  }
};

Blockly.Blocks['sumorobot_delay'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip("");
  }
};

Blockly.Blocks['sumorobot_opponent'] = {
  init: function() {
    var OPERATORS =
      [['ENEMY LEFT', 'OPPONENT_LEFT'],
       ['ENEMY FRONT', 'OPPONENT_FRONT'],
       ['ENEMY RIGHT', 'OPPONENT_RIGHT']];
    this.setColour(120);
    var dropdown = new Blockly.FieldDropdown(OPERATORS);
    this.appendDummyInput().appendField(dropdown, 'ENEMY');
    this.setOutput(true, 'Boolean');
    this.setTooltip("");
  }
};

Blockly.Blocks['sumorobot_line'] = {
  init: function() {
    var OPERATORS =
      [['LINE LEFT', 'BOTTOM_LEFT'],
       ['LINE MIDDLE', 'BOTTOM_MIDDLE'],
       ['LINE RIGHT', 'BOTTOM_RIGHT']];
    this.setColour(120);
    var dropdown = new Blockly.FieldDropdown(OPERATORS);
    this.appendDummyInput().appendField(dropdown, 'LINE');
    this.setOutput(true, 'Boolean');
    this.setTooltip("");
  }
};