'use strict';
/**
 * Slack provider module Notification class
 * @module sockbot.providers.nodebb.Notification
 * @author Yamikuronue
 * @author  Accalia
 * @license MIT
 */
const debug = require('debug')('sockbot:providers:slack:notifications');

/**
 * Create a Notification class and bind it to a forum instance
 *
 * @param {Provider} forum A forum instance to bind to constructed Notification class
 * @returns {Notification} A Notification class bound to the provided `forum` instance
 */
exports.bindNotification = function bindNotification(forum) {

    /**
     * Notification types enum
     *
     * @readonly
     * @enum
     */
    const notificationType = { //eslint-disable-line no-unused-vars
        notification: 'notification',
        reply: 'reply',
        mention: 'mention'
    };

    const mappedTypes = ['message'];

    /**
     * Notification Class
     *
     * Represents a forum notification
     *
     * @public
     */
    class Notification {
        /**
         * Construct a Notification object from payload
         *
         * This constructor is intended to be private use only, if you need to construct a notification from payload
         * data use `Notification.parse()` instead
         *
         * @public
         * @class
         *
         * @param {*} payload Payload to construct the Notification object out of
         */
        constructor(payload) {
            /* Type checking*/
            if (payload.text && payload.text.indexOf('@' + forum.userId) > -1) {
                this._type = notificationType.mention;
            } else {
                this._type = notificationType.notification;
            }
            this._body = payload.text;
            this._user = payload.user;
            this._date = payload.ts;
            this._post = forum.Post.parse(payload);
            
        }

        /**
         * Unique notification id of this notification
         *
         * @public
         *
         * @type {string}
         */
        get id() {
            return 0;
        }

        /**
         * Post id this notification refers to
         *
         * @public
         *
         * @type {number}
         */
        get postId() {
            return this._post.id;
        }

        /**
         * Topic id this post refers to
         *
         * @public
         *
         * @type {number}
         */
        get topicId() {
            return this._post.topicId;
        }

        /**
         * User id that generated this notification
         *
         * @public
         *
         * @type {number}
         */
        get userId() {
            return this._user;
        }

        /**
         * Notification type code
         *
         * @public
         *
         * @type {notificationType}
         */
        get type() {
            return this._type;
        }

        /**
         * Notification subtype
         *
         * @public
         *
         * @type {string}
         */
        get subtype() {
            return this._type;
        }

        /**
         * Is this notification read yet?
         *
         * @public
         *
         * @type {boolean}
         */
        get read() {
            return true;
        }

        /**
         * Datetime this notification was generated on
         *
         * @public
         *
         * @type {Date}
         */
        get date() {
            return this._ts;
        }

        /**
         * Notification label
         *
         * @public
         *
         * @type {string}
         */
        get label() {
            return '';
        }

        /**
         * Content of notification.
         *
         * @public
         *
         * @type {string}
         */
        get body() {
            return this._body;
        }

        /**
         * HTML Markup for this notification body
         *
         * @public
         *
         * @returns {Promise<string>} Resolves to the notification markup
         *
         * @promise
         * @fulfill the Notification markup
         */
        getText() {
            return Promise.resolve(this._body);
        }

        /**
         * URL Link for the notification if available
         *
         * @public
         *
         * @returns {Promise<string>} Resolves to the URL for the post the notification is for
         *
         * @promise
         * @fullfil {string} The URL for the post the notification is for
         */
        url() {
            return Promise.reject('No can do');
        }

        /**
         * Get the post this Notification refers to
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the post the notification refers to
         *
         * @promise
         * @fulfill {Post} the Post the notification refers to
         */
        getPost() {
            return Promise.resolve(this._post);
        }

        /**
         * Get the topic this Notification refers to
         *
         * @public
         *
         * @returns {Promise<Topic>} Resolves to the topic the notification refers to
         *
         * @promise
         * @fulfill {Topic} the Topic the notification refers to
         */
        getTopic() {
           return forum.Topic.get(this._post.topicId);
        }

        /**
         * Get the user who generated this Notification
         *
         * @public
         *
         * @returns {Promise<User>} Resolves to the user who generated this notification
         *
         * @promise
         * @fulfill {Post} the User who generated this notification
         */
        getUser() {
            return forum.User.get(this._user);
        }

        /**
         * Get a notification
         *
         * @public
         * @static
         *
         * @param {string} notificationId The id of the notification to get
         * @returns {Promise<Notification>} resolves to the retrieved notification
         *
         *@promise
         * @fulfill {Notification} the retrieved notification
         */
        static get(notificationId) {
            return Promise.reject("Not yet implemented");
        }

        /**
         * Parse a notification from a given payload
         *
         * @public
         * @static
         *
         * @param {*} payload The notification payload
         * @returns {Notification} the parsed notification
         */
        static parse(payload) {
            return new Notification(payload);
        }

        /**
         * Notification processor
         *
         * @typedef {NotificationProcessor}
         * @function
         *
         * @param {Notification} notification Notification to process
         * @returns {Promise} Resolves on completion
         */


        /**
         * Activate notifications.
         *
         * Listen for new notifications and process ones that arrive
         */
        static activate() {
            forum.Slack.on('message', notifyHandler);
            forum.emit('log', 'Notifications Activated: Now listening for new notifications');
            return Promise.resolve();
        }

        /**
         * Deactivate notifications
         *
         * Stop listening for new notifcations.
         */
        static deactivate() {
            forum.Slack.off('message', notifyHandler);
            forum.emit('log', 'Notifications Deactivated: No longer listening for new notifications');
            return Promise.resolve();
        }
    }

    /**
     * Handle notifications that arrive
     *
     * Parse notification from event and process any commands cound within
     *
     * @private
     *
     * @param {*} data Notification data
     * @returns {Promise} Resolved when any commands contained in notificaiton have been processed
     */
    function notifyHandler(data) {
        //Filter unwanted types; slack is noisy
        if (mappedTypes.indexOf(data.type) > -1) {
            debug('Received message');
            const notification = Notification.parse(data);
            debug(`Notification ${notification.type}: ${notification.body} received`);
            forum.emit(`notification:${notification.type}`, notification);
            forum.emit('notification', notification);
            
            const postId = forum.Post.save(notification._post);
            const ids = {
                post: postId,
                topic: notification.topicId,
                user: notification.userId,
                room: -1
            };
            return notification.getText()
                .then((postData) => forum.Commands.get(ids,
                    postData, (content) => forum.Post.reply(notification.topicId, notification.postId, content)))
                .then((command) => command.execute());
            } else {
                return Promise.resolve();
            }
        }

    return Notification;
};