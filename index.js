
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
const userModule = require('./User');

/**
 * Forum connector
 *
 * Connects to a Slack "forum"
 */
class Forum extends EventEmitter {

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
        super();
    	this._config = config;
    	this._plugins = [];
    	this._slack = new Slack(config.core.apiToken);
    	this._userModule = userModule.bindUser(this);
    }

    get Slack() {
    	return this._slack;
    }
    
    set Slack(s) {
        this._slack = s;
    }

     /**
     * Bot instance configuration
     *
     * @public
     *
     * @type {object}
     */
    get config() {
        return this._config;
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
        return this._userModule;
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
        return this._commands;
    }

    /**
     * Store Commands object bound to this instance
     *
     * @private
     *
     * @param {Commands} commands commands Instance
     */
    set Commands(commands) {
        this._commands = commands;
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
        return Promise.resolve();
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
        let that = this;
        return new Promise(function(resolve, reject) {
        	that.Slack.api('rtm.start', function(err, apiResponse) {
        	    if (err) {
        	        reject(err);
        	    }
            	that.socket = io(apiResponse.url);
    	        that.socket.on('pong', (data) => this.emit('log', `Ping exchanged with ${data}ms latency`));
    	        that.socket.on('connect', () => this.emit('connect'));
    	        that.socket.on('disconnect', () => this.emit('disconnect'));
    	        that.socket.once('connect', () => resolve());
    	        that.socket.once('error', (err) => reject(err));
            })
        }).then(() => {
            return Promise.all(this._plugins.map((plugin) => plugin.activate()));
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
module.exports = Forum;