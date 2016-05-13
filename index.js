
'use strict';
/**
 * Slack provider module
 * @module sockbot.providers.slack
 * @author yamikuronue
 * @license MIT
 */

const EventEmitter = require('events').EventEmitter;
const Slack = require('slack-node');
const io = require('socket.io-client');

/**
 * Forum connector
 *
 * Connects to a Slack "forum"
 */
class Forum extends EventEmitter {

	let _config,
	_plugins,
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
    	Slack = new Slack(config.core.apiToken);
    }

    get Slack() {
    	return Slack;
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
       return new Promise((resolve, reject) => {
            let fn = fnPlugin;
            if (typeof fn !== 'function') {
                fn = fn.plugin;
            }
            const plugin = fn(this, pluginConfig);
            if (typeof plugin !== 'object') {
                return reject('[[invalid_plugin:no_plugin_object]]');
            }
            if (typeof plugin.activate !== 'function') {
                return reject('[[invalid_plugin:no_activate_function]]');
            }
            if (typeof plugin.deactivate !== 'function') {
                return reject('[[invalid_plugin:no_deactivate_function]]');
            }
            this._plugins.push(plugin);
            return resolve();
        });
    }

    /**
     * Activate forum and plugins
     *
     * @returns {Promise} Resolves when all plugins have been enabled
     */
    activate() {
        return Promise.reject("not yet implemented");
        return new Promise(function(resolve, reject) {
        	this.Slack.api('rtm.start', function(err, apiResponse) {
	        	this.socket = io(apiResponse.url);
		        this.socket.on('pong', (data) => this.emit('log', `Ping exchanged with ${data}ms latency`));
		        this.socket.on('connect', () => this.emit('connect'));
		        this.socket.on('disconnect', () => this.emit('disconnect'));
		        this.socket.once('connect', () => resolve());
		        this.socket.once('error', (err) => reject(err));
	        })
        });

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