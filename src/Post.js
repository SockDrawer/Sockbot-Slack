'use strict';
/**
 * NodeBB provider module Post class
 * @module sockbot.providers.slack.Post
 * @author yamikuronue
 * @license MIT
 */

 const debug = require('debug')('sockbot:providers:slack:posts');
 const loki = require('lokijs');
 
 const db = new loki('post_history.json');
 const postHistory = db.addCollection('postHistory');


/**
 * Create a Post class and bind it to a forum instance
 *
 * @param {Provider} forum A forum instance to bind to constructed Post class
 * @returns {User} A Post class bound to the provided `forum` instance
 */
exports.bindPost = function bindPost(forum) {
    /**
     * Post Class
     *
     * Represents a forum post
     *
     * @public
     */
    class Post {
        /**
         * Construct a Post object from payload
         *
         * This constructor is intended to be private use only, if you need to construct a post from payload data use
         * `Post.parse()` instead
         *
         * @public
         * @class
         *
         * @param {*} payload Payload to construct the Post object out of
         */
        constructor(payload) {
                this._userId = payload.user;
                this._content = payload.text;
                this._posted = new Date(payload.ts);
                this._topicId = payload.channel;
        }

        /**
         * ID of the post author
         *
         * @public
         *
         * @type {!number}
         */
        get authorId() {
            return this._userId;
        }

        /**
         * Raw content of the post, before any HTML transformation has been applied
         *
         * @public
         *
         * @type {string}
         */
        get content() {
            return this._content;
        }

        /**
         * DateTime that the post was posted
         *
         * @public
         *
         * @type {Date}
         */
        get posted() {
            return this._posted;
        }

        /**
         * ID of the post
         *
         * @public
         *
         * @type {number}
         */
        get id() {
            return 0;
        }

        /**
         * ID of the topic that contains this post
         *
         * @public
         *
         * @type {number}
         */
        get topicId() {
            return this._topicId;
        }
        
        
        /**
         * Retrieve the HTML representation of the raw content of the post
         *
         * @public
         *
         * @returns {Promise<string>} Resolves to the HTML markup for the post
         *
         * @promise
         * @fulfill {string} The HTML markup for this post
         * @reject {Error} An Error that occured while deleting
         */
        markup() {
            return this._content;
        }

        /**
         * Retrieve the direct URL for this post
         *
         * @public
         *
         * @returns {Promise<string>} Resolves to the web URL for this post
         *
         * @promise
         * @fulfill {string} The web URL for this post
         * @reject {Error} An Error that occured while retreiving post URL
         */
        url() {
            return Promise.reject("No such thing");
        }

        /**
         * Reply to this post with the given content
         *
         * @public
         *
         * @param {string} content Post content
         * @returns {Promise<Post>} Resolves to the newly created Post
         *
         * @promise
         * @fulfill {Post} The newly created Post
         * @reject {Error} An Error that occured while posting
         */
        reply(content) {
            return Post.reply(this.topicId, this.id, content);
        }

        /**
         * Post a reply to a post with the given content
         *
         * @public
         * @static
         *
         * @param {string} topicId Topic Id to reply to
         * @param {string} postId Post Id to reply to
         * @param {string} content Post content
         * @returns {Promise<Post>} Resolves to the newly created Post
         *
         * @promise
         * @fulfill {Post} The newly created Post
         * @reject {Error} An Error that occured while posting
         */
        static reply(topicId, postId, content) {
            debug('sending reply: ' + content + ' to ' + topicId);
            return forum.Slack.postMessage(topicId, content)
                .catch((err) => {
                if (err.message === 'no_text') {
                    return Promise.resolve();
                } else {
                    return Promise.reject(new Error(err.message));
                }
            });
        }

        /**
         * Edit this post to contain new content
         *
         * @public
         *
         * @param {string} newContent New post content
         * @param {string} [reason] Post edit reason
         *
         * @returns {Promise<Post>} Resolves to the edited Post
         *
         * @promise
         * @fulfill {Post} The edited Post
         * @reject {Error} An Error that occured while editing
         */
        edit(newContent, reason) {
            return Promise.reject("Not yet implemented");
        }

        /**
         * Append new content to this post
         *
         * @public
         *
         * @param {string} newContent New post content
         * @param {string} [reason] Post edit reason
         *
         * @returns {Promise<Post>} Resolves to the edited post
         *
         * @promise
         * @fulfill {Post} The edited Post
         * @reject {Error} An Error that occured while editing
         */
        append(newContent, reason) {
           return Promise.reject("Not yet implemented");
        }


        /**
         * Delete this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the deleted post
         *
         * @promise
         * @fulfill {Post} The deleted Post
         * @reject {Error} An Error that occured while deleting
         */
        delete() {
            return Promise.reject("Not yet implemented");
        }

        /**
         * Undelete this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the undeleted post
         *
         * @promise
         * @fulfill {Post} The undeleted Post
         * @reject {Error} An Error that occured while deleting
         */
        undelete() {
            return Promise.reject("Not yet implemented");
        }

        /**
         * Upvote this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the upvoted post
         *
         * @promise
         * @fulfill {Post} The upvoted Post
         * @reject {Error} An Error that occured while upvoting
         */
        upvote() {
            return Promise.reject("No can do");
        }

        /**
         * Downvote this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the downvoted post
         *
         * @promise
         * @fulfill {Post} The downvoted Post
         * @reject {Error} An Error that occured while downvoting
         */
        downvote() {
            return Promise.reject("No can do");
        }

        /**
         * Unvote this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the unvoted post
         *
         * @promise
         * @fulfill {Post} The unvoted Post
         * @reject {Error} An Error that occured while downvoting
         */
        unvote() {
            return Promise.reject("No can do");
        }

        /**
         * Bookmark this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the bookmarked post
         *
         * @promise
         * @fulfill {Post} The bookmarked post
         * @reject {Error} An Error that occured while bookmarking
         */
        bookmark() {
            return Promise.reject("No can do");
        }

        /**
         * Remove a bookmark from this post
         *
         * @public
         *
         * @returns {Promise<Post>} Resolves to the unbookmarked post
         *
         * @promise
         * @fulfill {Post} The unbookmarked post
         * @reject {Error} An Error that occured while unbookmarking
         */
        unbookmark() {
            return Promise.reject("No can do");
        }


        /**
         * Construct a post object from a previously retrieved payload
         *
         * @public
         * @static
         *
         * @param {*} payload Serialized post representation retrieved from forum
         * @returns {Post} the deserialized Post object
         */
        static parse(payload) {
            if (!payload) {
                throw new Error('E_POST_NOT_FOUND');
            }
            return new Post(payload);
        }
        
         /**
         * Render the content to HTML as it would be rendered for a post
         *
         * @public
         * @static
         *
         * @param {string} content Content to render HTML PReview for
         * @returns {Promise<String>} Resolves to the rendered HTML
         *
         * @promise
         * @fulfill {string} Rendered HTML for `content`
         * @reject {Error} Any error that occurred rendering HTML for `content`
         *
         */
        static preview(content) {
            return Promise.resolve(content);
        }
        
        static get(id) {
            let post = postHistory.get(id);
            return post ? Promise.resolve(post) : Promise.reject('No post found');
        }
        
        get(id) {
            let post = postHistory.get(id);
            return post ? Promise.resolve(post) : Promise.reject('No post found');
        }
        
        static save(post) {
            post = postHistory.insert(post);
            return post.$loki;
        }

    }
    return Post;
};