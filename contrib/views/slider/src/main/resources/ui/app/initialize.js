/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

window.App = require('config/app');

require('config/router');
require('config/store');
require('translations');
require('mappers/mapper');

App.initializer({
  name: "preload",

  initialize: function(container, application) {
    var viewId = 'SLIDER';
    var viewVersion = '1.0.0';
    var instanceName = 'SLIDER_1';
    if (location.pathname != null) {
      var splits = location.pathname.split('/');
      if (splits != null && splits.length > 4) {
        viewId = splits[2];
        viewVersion = splits[3];
        instanceName = splits[4];
      }
    }
    
    application.reopen({
      /**
       * Test mode is automatically enabled if running on brunch server
       * @type {bool}
       */
      testMode: (location.port == '3333'),

      /**
       * @type {string}
       */
      name: viewId,

      /**
       * Slider version
       * @type {string}
       */
      version: viewVersion,

      /**
       * @type {string}
       */
      instance: instanceName,

      /**
       * API url for Slider
       * Format:
       *  <code>/api/v1/views/[VIEW_NAME]/versions/[VERSION]/instances/[INSTANCE_NAME]/</code>
       * @type {string}
       */
      urlPrefix: function() {
        return '/api/v1/views/%@1/versions/%@2/instances/%@3/'.fmt(this.get('name'), this.get('version'), this.get('instance'));
      }.property('name', 'version', 'instance'),

      /**
       * Should Slider View be enabled
       * @type {bool}
       */
      viewEnabled: false,

      /**
       * List of errors
       * @type {string[]}
       */
      viewErrors: [],

      /**
       * Host with Nagios Server
       * @type {string|null}
       */
      nagiosHost: null,

      /**
       * Host with Ganglia Server
       * @type {string|null}
       */
      gangliaHost: null,

      /**
       * List of Ganglia clusters
       * @type {array|null}
       */
      gangliaClusters: null,

      /**
       * Last time when mapper ran
       * @type {null|number}
       */
      mapperTime: null

    });
    application.SliderController.proto().initResources();
    application.ApplicationTypeMapper.load();
    application.SliderAppsMapper.run('load');
  }
});

// Load all modules in order automatically. Ember likes things to work this
// way so everything is in the App.* namespace.
var folderOrder = [
    'initializers', 'mixins', 'routes', 'models', 'mappers',
    'views', 'controllers', 'helpers',
    'templates', 'components'
  ];

folderOrder.forEach(function(folder) {
  window.require.list().filter(function(module) {
    return new RegExp('^' + folder + '/').test(module);
  }).forEach(function(module) {
    require(module);
  });
});

$.ajaxSetup({
  cache : false,
  headers : {
    "X-Requested-By" : "X-Requested-By"
  }
});