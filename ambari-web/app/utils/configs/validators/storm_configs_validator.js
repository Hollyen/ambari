/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var App = require('app');
require('utils/configs/validators/service_configs_validator');

App.STORMConfigsValidator = App.ServiceConfigsValidator.create({
  /**
   * List of the configs that should be validated
   */
  configValidators: {
    'supervisor.childopts': 'supervisorChildOpts',
    'nimbus.childopts': 'nimbusChildOpts',
    'drpc.childopts': 'drpcChildOpts',
    'ui.childopts': 'uiChildOpts',
    'logviewer.childopts': 'logviewerChildOpts',
    'worker.childopts': 'workerChildOpts'
  },

  supervisorChildOpts: function(config) {
    return this.validateXmxValue(config);
  },

  nimbusChildOpts: function(config) {
    return this.validateXmxValue(config);
  },

  drpcChildOpts: function(config) {
    return this.validateXmxValue(config);
  },

  uiChildOpts: function(config) {
    return this.validateXmxValue(config);
  },

  logviewerChildOpts: function(config) {
    return this.validateXmxValue(config);
  },

  workerChildOpts: function(config) {
    return this.validateXmxValue(config);
  }
});