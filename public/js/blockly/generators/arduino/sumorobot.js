/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Arduino for logic blocks.
 * @author silver.kuusik@gmail.com  (Silver Kuusik)
 */

'use strict';

goog.provide('Blockly.Arduino.sumorobot');

goog.require('Blockly.Generator');

Blockly.Arduino['sumorobot_libraries'] = function(block) {
  var code = "#include <Servo.h>\n#include <Sumorobot.h>\n\n";
  return code;
};

Blockly.Arduino['sumorobot_main'] = function(block) {
  var statements_setup = Blockly.Arduino.statementToCode(block, 'setup');
  var statements_loop = Blockly.Arduino.statementToCode(block, 'loop');
  var code = "void setup() {\n" + statements_setup + "}\nvoid loop() {\n" + statements_loop + "}";
  return code;
};

Blockly.Arduino['sumorobot_delay'] = function(block) {
  var code = "delay(" + parseFloat(block.getFieldValue('DELAY')) + ");\n";
  return code;
};

Blockly.Arduino['sumorobot_motor'] = function(block) {
  var code = "start();\n";
  return code;
};

Blockly.Arduino['sumorobot_spin'] = function(block) {
  var code = block.getFieldValue('SPIN') + "(" + block.getFieldValue('DELAY') + ");\n";
  return code;
};

Blockly.Arduino['sumorobot_move'] = function(block) {
  var code = block.getFieldValue('MOVE') + "(" + block.getFieldValue('DELAY') + ");\n";
  return code;
};

Blockly.Arduino['sumorobot_enemy'] = function(block) {
  var code = block.getFieldValue('ENEMY');
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['sumorobot_line'] = function(block) {
  var code = block.getFieldValue('LINE');
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};