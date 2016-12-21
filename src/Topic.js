'use strict';
/**
 * Slack provider module Topic class. A topic is here defined as a Channel. 
 * @module sockbot.providers.slack.Topic
 * @author Yamikuronue
 * @license MIT
 */
 const debug = require('debug')('sockbot:providers:slack:topic');
 
/**
 * Create a Topic class and bind it to a forum instance
 *
 * @param {Provider} forum A forum instance to bind to constructed Topic class
 * @returns {User} A Topic class bound to the provided `forum` instance
 */
exports.bindTopic = function bindTopic(forum) {
    /**
     * Topic Class
     *
     * Represends a forum topic
     *
     * @public
     *
     */
    class Topic {
        /**
         * Construct a topic object from a provided payload.
         *
         * This constructor is intended for private use only, if you need top construct a topic from payload data use
         * `Topic.parse()` instead.
         *
         * @public
         * @class
         *
         * @param {*} payload Payload to construct the User object out of
         */
        constructor(payload) {
            this._creator = payload.creator;
            this._name = payload.name;
            this._created = new Date(payload.created);
            this._id = payload.id;
        }

        /**
         * ID for channel creator
         *
         * @public
         *
         * @type {!number}
         */
        get authorId() {
            return this._creator;
        }

        /**
         * Channel title/name
         *
         * @public
         *
         * @type {!string}
         */
        get title() {
            return this._name;
        }

        /**
         * DateTime that the topic was created
         *
         * @public
         *
         * @type {!Date}
         */
        get posted() {
            return this._created;
        }

        /**
         * DateTime that the topic was last replied to
         *
         * @public
         *
         * @type {!Date}
         */
        get lastPosted() {
            throw new Error("Not recorded");
        }

        /**
         * Forum Specific Topic Id
         *
         * @public
         *
         * @type {!number}
         */
        get id() {
            return this._id;
        }

        /**
         * Forum id of the opening post
         *
         * @public
         *
         * @type {!number}
         */
        get mainPostId() {
            throw new Error("Not possible");
        }

        /**
         * Count of posts in topic
         *
         * @public
         *
         * @type {number}
         */
        get postCount() {
            throw new Error("Not possible");
        }

        /**
         * Retrieve the web URL for the topic
         *
         * @public
         *
         * @returns {Promise<string>} Resolves to the web URL for this topic
         *
         * @promise
         * @fulfill {string} The Web URL for this topic
         * @reject {Error} An Error that occured while retrieving the post URL
         */
        url() {
            throw new Error("Not possible");
        }

        /**
         * Reply to this topic with the given content
         *
         * @public
         *
         * @param {string} content Post Content
         * @returns {Promise<Post>} Resolves to the newly created Post
         *
         * @promise
         * @fulfill {Post} The newly created Post
         * @reject {Error} An Error that occured while posting
         */
        reply(content) {
            return forum.Slack.postMessage(this._id, content);
        }

    
        /**
         * Retrieve all posts from this topic, passing each off to a provided iterator function.
         *
         * @public
         *
         * @param {PostProcessor} eachPost A function to process retrieved posts.
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        getAllPosts(eachPost) {
            throw new Error("I can't let you do that, dave");
        }

        /**
         * Retrieve most posts from this topic, passing each off to a provided iterator function.
         *
         * @public
         *
         * @param {PostProcessor} eachPost A function to process retrieved posts.
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        getLatestPosts(eachPost) {
             throw new Error("I can't let you do that, dave");
        }

        /**
         * Mark the topic read up to a point
         *
         * @public
         *
         * @param {number} [postNumber] Last read post. Omit to mark the entire topic read
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        markRead(postNumber) {
           //TODO
        }

        /**
         * Watch the topic for new replies
         *
         * @public
         *
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        watch() {
            return this.join();
        }

        /**
         * Stop watching the tipic for new replies
         *
         * @public
         *
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        unwatch() {
            return this.part();
        }

        /**
         * Mute the topic to suppress notifications
         *
         * @public
         *
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        mute() {
            return this.part();
        }

        /**
         * Unmute the topic, allowing notifications to be generated again.
         *
         * @public
         *
         * @returns {Promise<Topic>} Resolves to self on completion
         *
         * @promise
         * @fulfill {Topic} Source Topic
         * @reject {Error} An Error that occured while posting
         */
        unmute() {
            return this.join();
        }
        
        join() {
            const name = this._name;
            return forum.Slack._api("channels.join", {
            		name: name
	            }).then(function(response) {
	                if (response.ok === true) {
	                    debug(`Joined channel ${name}`);
	                    return true;
	                } else {
	                    throw new Error(response.ok);
	                }
				});
        }
        
        part() {
            const name = this._name;
            return forum.Slack._api("channels.leave", {
            		name: name
	            }).then(function(response) {
	                if (response.ok === true) {
	                    debug(`Left channel ${name}`);
	                    return true;
	                } else {
	                    throw new Error(response.ok);
	                }
				});
        }

        /**
         * Retrieve a topic by topic id
         *
         * @static
         * @public
         *
         * @param {String} topicId Id of topic/channel to retrieve
         * @returns {Promise<Topic>} Retrieved topic
         *
         * @promise
         * @fulfill {Topic} Retrieved Topic
         * @reject {Error} An Error that occured while posting
         */
        static get(topicId) {
            debug(`getting topic ${topicId}`);
            return forum.Slack.getChannelById(topicId).then((response) => {
                debug(response);
                return Topic.parse(response);
            });
        }
        
        /**
         * Retrieve a topic by topic name
         *
         * @static
         * @public
         *
         * @param {String} channelName The human-friendly name of the channel
         * @returns {Promise<Topic>} Retrieved topic
         *
         * @promise
         * @fulfill {Topic} Retrieved Topic
         * @reject {Error} An Error that occured while posting
         */
        static getByName(channelName) {
            debug(`getting channel ${channelName}`);
            return forum.Slack.getChannel(channelName).then(Topic.parse);
        }

        /**
         * Parse a topic from retrieved data
         *
         * @public
         *
         * @param {*} payload Payload to parse into a topic
         * @returns {Topic} Parsed topic
         */
        static parse(payload) {
            return new Topic(payload);
        }
    }
    return Topic;
};