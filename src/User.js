'use strict';
/**
 * Slack provider module User class
 * @module sockbot.providers.slack.User
 * @author Yamikuronue
 * @license MIT
 */
 
 const debug = require('debug')('sockbot:providers:slack:users');


/**
 * Create a User class and bind it to a forum instance
 *
 * @param {Provider} forum A forum instance to bind to constructed User class
 * @returns {User} A User class bound to the provided `forum` instance
 */
exports.bindUser = function bindUser(forum) {
/**
     * User Class
     *
     * Represents a slack user
     *
     * @public
     */
    class User {

		/**
         * Construct a User object from payload
         *
         * This constructor is intended to be private use only, if you need to construct a user from payload data use
         * `User.parse()` instead
         *
         * @public
         * @class
         *
         * @param {*} payload Payload to construct the User object out of
         */
        constructor(payload) {
        	this._id = payload.id;
        	this._username = payload.name;
        	this._name = payload.real_name;
        	this._email = payload.profile.email;
        }

        /**
         * Forum Specific User Id
         *
         * @public
         *
         * @type {!number}
         */
        get id() {
            return this._id;
        }
        
         /**
         * Descriptive name of the User
         *
         * @public
         *
         * @type {?string}
         */
        get name() {
            return this._name;
        }

        /**
         * Username of the User
         *
         * @public
         *
         * @type {!string}
         */
        get username() {
            return this._username;
        }

        /**
         * Email address of the User. 
         *
         * @public
         *
         * @type {?string}
         */
        get email() {
            return  this._email;
        }

        /**
         * Link to avatar image for user. Currently always undefined
         *
         * @public
         *
         * @type {!string}
         */
        get avatar() {
            return undefined;
        }

        /**
         * Number of posts User has made. Currently always undefined
         *
         * @public
         *
         * @type {!number}
         */
        get postCount() {
            return undefined;
        }

        /**
         * Number of topics User has created. Always undefined
         *
         * @public
         *
         * @type {!number}
         */
        get topicCount() {
            return undefined;
        }

        /**
         * User reputation. Always undefined
         *
         * @public
         *
         * @type {!number}
         */
        get reputation() {
            return undefined;
        }

        /**
         * Datetime User last made a publically visible post. Currently always undefined
         *
         * @public
         *
         * @type {!Date}
         */
        get lastPosted() {
            return undefined;
        }

        /**
         * Datetime User was last seen online. Currently always undefined
         *
         * @public
         *
         * @type {!Date}
         */
        get lastSeen() {
            return undefined;
        }

        /**
         * Url to User profile. Always rjects
         *
         * @public
         *
         * @returns {Promise<string>} A promise that resolves to the desired URL
         *
         * @promise
         * @fulfill {string} The desired Url
         * @reject {Error} An Error that occured while determining URL
         */
        url() {
            return Promise.reject("Not applicable");
        }

        /**
         * Follow the User. 
         *
         * @public
         *
         * @returns {Promise<User>} Always rejects
         *
         * @promise
         * @fulfill {User} The followed User
         * @reject {Error} An Error that occured while processing
         */
        follow() {
            return Promise.reject("Stalker no stalking!");
        }

        /**
         * Unfollow the User
         *
         * @public
         *
         * @returns {Promise<user>} Always rejects
         *
         * @promise
         * @fulfill {User} The unfollowed User
         * @reject {Error} An Error that occured while processing
         */
        unfollow() {
            return Promise.reject("Stalker no stalking!");
        }

        /**
         * Get User by Id
         *
         * @static
         * @public
         *
         * @param {!number} userId ID of the user to retrieve
         * @returns {Promise<User>} Resolves to the retrieved User
         *
         * @promise
         * @fulfill {User} The retrieved User
         * @reject {Error} An Error that occured while processing
         *
         */
        static get(userId) {
            debug(`retrieving user by id ${userId}`);
            return forum.Slack._api("users.info", {
            		user: userId
	            }).then(function(response) {
	                debug(`${userId} resolved to ${response.user.name}`);
	            	return new User(response.user);
				});
        }

         /**
         * Get User by username
         *
         * @static
         * @public
         *
         * @param {!string} username Username of the user to retrieve
         * @returns {Promise<User>} Resolves to the retrieved User
         *
         * @promise
         * @fulfill {User} The retrieved User
         * @reject {Error} An Error that occured while processing
         *
         */
        static getByName(username) {
            debug(`retrieving user by login ${username}`);
            return forum.Slack.getUser(username).then((user) => {
                return new User(user);
            });
        }

        /**
         * Parse user from retrieved payload
         *
         * @static
         * @public
         *
         * @param {!*} payload Data to parse as a User object
         * @returns {Promise<User>} Resolves to the parsed User
         *
         * @promise
         * @fulfill {User} The parsed User
         * @reject {Error} An Error that occured while processing
         *
         */
        static parse(payload) {
            return new User(payload);
        }
    }
    return User;
};
