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

    const mentionTester = new RegExp(`(^|\\s)@${forum.username}(\\s|$)`, 'i');

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

    const mappedTypes = ['message']

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
            payload = JSON.parse(payload);

            this.body = payload.text;
            this.type = 'message';
            this.user = payload.user;
            
            utils.mapSet(this, values);
        }

        /**
         * Unique notification id of this notification
         *
         * @public
         *
         * @type {string}
         */
        get id() {
            return utils.mapGet(this, 'id');
        }

        /**
         * Post id this notification refers to
         *
         * @public
         *
         * @type {number}
         */
        get postId() {
            return utils.mapGet(this, 'postId');
        }

        /**
         * Topic id this post refers to
         *
         * @public
         *
         * @type {number}
         */
        get topicId() {
            return utils.mapGet(this, 'topicId');
        }

        /**
         * User id that generated this notification
         *
         * @public
         *
         * @type {number}
         */
        get userId() {
            return utils.mapGet(this, 'userId');
        }

        /**
         * Notification type code
         *
         * @public
         *
         * @type {notificationType}
         */
        get type() {
            return utils.mapGet(this, 'type');
        }

        /**
         * Notification subtype
         *
         * @public
         *
         * @type {string}
         */
        get subtype() {
            return utils.mapGet(this, 'subtype');
        }

        /**
         * Is this notification read yet?
         *
         * @public
         *
         * @type {boolean}
         */
        get read() {
            return utils.mapGet(this, 'read');
        }

        /**
         * Datetime this notification was generated on
         *
         * @public
         *
         * @type {Date}
         */
        get date() {
            return utils.mapGet(this, 'date');
        }

        /**
         * Notification label
         *
         * @public
         *
         * @type {string}
         */
        get label() {
            return utils.mapGet(this, 'label');
        }

        /**
         * Content of notification.
         *
         * @public
         *
         * @type {string}
         */
        get body() {
            return utils.mapGet(this, 'body');
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
            if (this.type === 'mention') {
                return forum.Post.preview(this.body);
            }
            return Promise.resolve(this.body);
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
            const value = utils.mapGet(this, 'url');
            return Promise.resolve(`${forum.url}/${value}`);
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
            return forum.Post.get(this.postId);
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
            return forum.Topic.get(this.topicId);
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
            return forum.User.get(this.userId);
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
            forum.socket.on('message', notifyHandler);
            forum.emit('log', 'Notifications Activated: Now listening for new notifications');
        }

        /**
         * Deactivate notifications
         *
         * Stop listening for new notifcations.
         */
        static deactivate() {
            forum.socket.off('message', notifyHandler);
            forum.emit('log', 'Notifications Deactivated: No longer listening for new notifications');
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
        if (mappedTypes.indexOf(parseJSON(data).type) > -1) {
            const notification = Notification.parse(data);
            debug(`Notification ${notification.id}: ${notification.label} received`);
            forum.emit(`notification:${notification.type}`, notification);
            forum.emit('notification', notification);
            const ids = {
                post: notification.postId,
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