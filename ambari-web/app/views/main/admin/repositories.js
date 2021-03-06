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

var App = require('app');
var stringUtils = require('utils/string_utils');

App.MainAdminRepositoriesView = Em.View.extend({
  templateName: require('templates/main/admin/repositories'),

  isUpgradeAvailable: function(){
    return stringUtils.compareVersions(this.get('controller.upgradeVersion').replace(App.get('currentStackName') + '-', ''), App.get('currentStackVersionNumber')) === 1;
  }.property('controller.upgradeVersion', 'App.currentStackName','App.currentStackVersionNumber'),

  didInsertElement: function () {
    this.get('controller').loadRepositories();
  },

  /**
   * List of all repo-groups
   * @type {Object[][]}
   */
  allRepositoriesGroups: function () {
    var repos = this.get('controller.allRepos');
    var reposGroup = [];
    var repositories = [];
    reposGroup.set('stackVersion', App.get('currentStackVersionNumber'));
    if (repos) {
      repos.forEach(function (group) {
        group.repositories.forEach (function(repo) {
          var cur_repo = Em.Object.create({
            'repoId': repo.repoId,
            'id': repo.repoId + '-' + repo.osType,
            'repoName' : repo.repoName,
            'stackName' : repo.stackName,
            'stackVersion' : repo.stackVersion,
            'baseUrl': repo.baseUrl,
            'originalBaseUrl': repo.baseUrl,
            'osType': repo.osType,
            'onEdit': false,
            'empty-error': !repo.baseUrl,
            'undo': false,
            'clearAll': repo.baseUrl
          });
          var cur_group = reposGroup.findProperty('name', group.name);
          if (!cur_group) {
            var cur_group = Ember.Object.create({
              name: group.name,
              repositories: []
            });
            reposGroup.push(cur_group);
          }
          cur_group.repositories.push(cur_repo);
          repositories.push(cur_repo);
        });
      });
    }
    this.set('allRepos', repositories);
    return reposGroup;
  }.property('controller.allRepos'),

  /**
   * Onclick handler for edit action of each repo, enter edit mode
   * @param {object} event
   */
  onEditClick:function (event) {
    var targetRepo = this.get('allRepos').findProperty('id', event.context.get('id'));
    if (targetRepo) {
      targetRepo.set('onEdit', true);
    }
  },

  /**
   * Onclick handler for undo action of each repo group
   * @method undoGroupLocalRepository
   * @param {object} event
   */
  undoGroupLocalRepository: function (event) {
    this.doActionForGroupLocalRepository(event, 'originalBaseUrl');
  },

  /**
   * Handler for clear icon click
   * @method clearGroupLocalRepository
   * @param {object} event
   */
  clearGroupLocalRepository: function (event) {
    this.doActionForGroupLocalRepository(event, '');
  },

  /**
   * Common handler for repo groups actions
   * @method doActionForGroupLocalRepository
   * @param {object} event
   * @param {string} newBaseUrlField
   */
  doActionForGroupLocalRepository: function (event, newBaseUrlField) {
    var targetRepo = this.get('allRepos').findProperty('id', event.context.get('id'));
    if (targetRepo) {
      targetRepo.set('baseUrl', Em.isEmpty(newBaseUrlField) ? '' : Em.get(targetRepo, newBaseUrlField));
    }
  },

  /**
   * Handler when editing any repo group BaseUrl
   * @method editGroupLocalRepository
   */
  editGroupLocalRepository: function (event) {
    var repos = this.get('allRepos');
    repos.forEach(function (targetRepo) {
      targetRepo.set('undo', targetRepo.get('baseUrl') != targetRepo.get('originalBaseUrl'));
      targetRepo.set('clearAll', targetRepo.get('baseUrl'));
      targetRepo.set('empty-error', !targetRepo.get('baseUrl'));

    });
  }.observes('allRepos.@each.baseUrl'),

  /**
   * onSuccess callback for save Repo URL.
   */
  doSaveRepoUrlsSuccessCallback: function (response, request, data) {
    var id = data.repoId + '-' + data.osType;
    console.log('Success in check Repo URL. data repoId+osType: ' + id);
    var targetRepo = this.get('allRepos').findProperty('id', id);
    if (!targetRepo) {
      return;
    } else {
      
      var modalCloseHandler = function() {
        this.hide();
        targetRepo.set('baseUrl', data.data.Repositories.base_url);
        targetRepo.set('originalBaseUrl', data.data.Repositories.base_url);
        targetRepo.set('onEdit', false);
      };

      App.ModalPopup.show({
        header: Em.I18n.t('admin.cluster.repositories.popup.header.success'),
        secondary: null,
        onPrimary: modalCloseHandler,
        onClose: modalCloseHandler,
        message: Em.I18n.t('admin.cluster.repositories.popup.body.success'),
        bodyClass: Em.View.extend({
          template: Em.Handlebars.compile('<div class="alert alert-success">{{{message}}}</div>')
        })
      })
    }
  },

  /**
   * onError callback for save Repo URL.
   */
  doSaveRepoUrlsErrorCallback: function (request, ajaxOptions, error, data) {
    console.log('Error in check Repo URL. The baseURL sent is:  ' + data.data);
    var self = this;
    var id = data.url.split('/')[10] + '-' + data.url.split('/')[8];
    var targetRepo = this.get('allRepos').findProperty('id', id);
    if (!targetRepo) {
      return;
    } else {
      App.ModalPopup.show({
        header: Em.I18n.t('admin.cluster.repositories.popup.header.fail'),
        primary: Em.I18n.t('common.saveAnyway'),
        secondary: Em.I18n.t('common.revert'),
        third: Em.I18n.t('common.cancel'),
        onPrimary: function () {
          // save anyway: Go ahead and save with Repo URL validation turned off and close Dialog when done.
          this.hide();
          self.doSaveRepoUrls(id, false);
        },
        onSecondary: function () {
          // Revert: Close dialog, revert URL value, go back to non-Edit mode
          this.hide();
          targetRepo.set('baseUrl', targetRepo.get('originalBaseUrl'));
          targetRepo.set('onEdit', false);
        },
        onThird: function () {
          // cancel: Close dialog but stay in Edit mode
          this.hide();
        },
        message: Em.I18n.t('admin.cluster.repositories.popup.body.fail'),
        bodyClass: Em.View.extend({
          template: Em.Handlebars.compile('<div class="alert alert-warning">{{{message}}}</div>')
        })
      })
    }
  },

  /**
   * Check validation and Save the customized local urls
   */
  doSaveRepoUrls: function (id, verifyBaseUrl) {
    var targetRepo = this.get('allRepos').findProperty('id', id);
    var verifyBaseUrl = verifyBaseUrl;
    App.ajax.send({
      name: 'wizard.advanced_repositories.valid_url',
      sender: this,
      data: {
        stackName: targetRepo.stackName,
        stackVersion: targetRepo.stackVersion,
        repoId: targetRepo.repoId,
        osType: targetRepo.osType,
        data: {
          'Repositories': {
            'base_url': targetRepo.baseUrl,
            "verify_base_url": verifyBaseUrl
          }
        }
      },
      success: 'doSaveRepoUrlsSuccessCallback',
      error: 'doSaveRepoUrlsErrorCallback'
    });
  },
  /**
   * Check validation and Save the customized local urls
   */
  saveRepoUrls: function (event) {
    this.doSaveRepoUrls(event.context.get('id'), true);
  },

  /**
   * on click handler 'Cancel' for current repo in edit mode
   */
  doCancel: function (event) {
    var targetRepo = this.get('allRepos').findProperty('id', event.context.get('id'));
    if (targetRepo) {
      targetRepo.set('baseUrl', targetRepo.get('originalBaseUrl'));
      targetRepo.set('onEdit', false);
    }
  }

});

