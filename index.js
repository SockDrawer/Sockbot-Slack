
'use strict';
/**
 * Slack provider module
 * @module sockbot.providers.slack
 * @author yamikuronue
 * @license MIT
 */

const EventEmitter = require('events').EventEmitter;
const Slack = require('slack-node');

/**
 * Forum connector
 *
 * Connects to a Slack "forum"
 */
class Forum extends EventEmitter {

	let _config, 
	Slack;

	/**
     * Create a forum connector instance
     *
     * @public
     * @class
     *
     * @param {object} config Bot configuration data
     * @param {string} useragent Useragent to use for all requests
     */
    constructor(config, useragent) {
    	_config = config;
    	slack = new Slack(config.core.apiToken);
    }

     /**
     * Bot instance configuration
     *
     * @public
     *
     * @type {object}
     */
    get config() {
        return _config;
    }


    /**
     * Useragent used by the instance
     *
     * @public
     *
     * @type {string}
     */
    get useragent() {
        return "Sockbot Slack Edition";
    }


    /**
     * Base URL for the forum
     *
     * @public
     *
     * @type {string}
     */
    get url() {
        return "";
    }

    /**
     * Username bot will log in as
     *
     * @public
     *
     * @type{string}
     */
    get username() {
        return this._config.core.username;
    }

     /**
     * Logged in Bot User
     *
     * @public
     *
     * @type {User}
     */
    get user() {
        throw new Error("Not yet implemented");
    }

    /**
     * Bot instance Owner user
     *
     * @public
     *
     * @type {User}
     */
    get owner() {
        return this._config.core.owner;
    }

    /**
     * Get Commands object bound to this instance
     *
     * @public
     *
     * @type {Commands}
     */
    get Commands() {
        throw new Error("Not yet implemented");
    }

    /**
     * Login to forum instance
     *
     * @returns {Promise<Forum>} Resolves to logged in forum
     *
     * @promise
     * @fulfill {Forum} Logged in forum
     */
    login() {
        return Promise.reject("not yet implemented");
    }

/**
     * Add a plugin to this forum instance
     *
     * @public
     *
     * @param {PluginFn|PluginGenerator} fnPlugin Plugin Generator
     * @param {object} pluginConfig Plugin configuration
     * @returns {Promise} Resolves on completion
     *
     * @promise
     * @fulfill {*} Plugin addedd successfully
     * @reject {Error} Generated plugin is invalid
     */
    addPlugin(fnPlugin, pluginConfig) {
       return Promise.reject("not yet implemented");
    }

    /**
     * Activate forum and plugins
     *
     * @returns {Promise} Resolves when all plugins have been enabled
     */
    activate() {
        return Promise.reject("not yet implemented");
    }

     /**
     * Deactivate forum and plugins
     *
     * @returns {Promise} Resolves when all plugins have been disabled
     */
    deactivate() {
        return Promise.reject("not yet implemented");
    }


}