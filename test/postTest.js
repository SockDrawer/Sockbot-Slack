'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

const sinon = require('sinon');
require('sinon-as-promised');
chai.use(require('sinon-chai'));

const postModule = require('../src/Post');

describe('providers/nodebb/post', () => {
    it('should export bindPost()', () => {
        postModule.bindPost.should.be.a('function');
    });
    it('should return a class on call to bindPost()', () => {
        postModule.bindPost({}).should.be.a('function');
    });
    describe('Post', () => {
        const forum = {
            Slack: {}
        };
        const Post = postModule.bindPost(forum);
        beforeEach(() => {
            forum._emit = sinon.stub().resolves();
            forum._emitWithRetry = sinon.stub().resolves();
            forum.fetchObject = sinon.stub().resolves();
        });
        describe('ctor()', () => {
            
        });
        describe('markup()', () => {
            it('should resolve to the content of the post', () => {
                const content = `a${Math.random()}b`;
                const post = new Post({text: content});
                return post.markup().should.equal(content);
            });
        });
        describe('url()', () => {
            let post = null;
            beforeEach(() => {
                post = new Post({});
            });
            it('should reject as impossible', () => {
                post.url().should.be.rejectedWith('No such thing');
            });
        });
        describe('reply()', () => {
            let post = null,
                data = null,
                sandbox = null;
            beforeEach(() => {
                sandbox = sinon.sandbox.create();
            });
            afterEach(() => sandbox.restore());
            it('should resolve to result of Post.reply', () => {
                const expected = Math.random();
                sandbox.stub(Post, 'reply').resolves(expected);
                return Post.reply(1, 2, 3).should.become(expected);
            });
            it('should pass post id, topicId and content to Post.reply()', () => {
                const id = 0; //slack gives no IDs
                const topicId = Math.random();
                const content = `a${Math.random()}b`;
                
                post = new Post({
                    text: content,
                    channel: topicId
                });
                sandbox.stub(Post, 'reply').resolves();
                
                return post.reply(content).then(() => {
                    Post.reply.should.have.been.calledWith(topicId, id, content).once;
                });
            });
        });
        describe('edit()', () => {
           let post = null;
            beforeEach(() => {
                post = new Post({});
            });
            it('should reject as unimplemented', () => {
                post.undelete().should.be.rejectedWith('Not yet implemented');
            });
        });
        describe('append()', () => {
           let post = null;
            beforeEach(() => {
                post = new Post({});
            });
            it('should reject as unimplemented', () => {
                post.undelete().should.be.rejectedWith('Not yet implemented');
            });
        });
        describe('post tools', () => {
            describe('delete()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as unimplemented', () => {
                    post.delete().should.be.rejectedWith('Not yet implemented');
                });
            });
            describe('undelete()', () => {
                 let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as unimplemented', () => {
                    post.undelete().should.be.rejectedWith('Not yet implemented');
                });
            });
            describe('upvote()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as impossible', () => {
                    post.upvote().should.be.rejectedWith('No can do');
                });
            });
            describe('downvote()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as impossible', () => {
                    post.downvote().should.be.rejectedWith('No can do');
                });
            });
            describe('unvote()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as impossible', () => {
                    post.unvote().should.be.rejectedWith('No can do');
                });
            });
            describe('bookmark()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as impossible', () => {
                    post.bookmark().should.be.rejectedWith('No can do');
                });
            });
            describe('unbookmark()', () => {
                let post = null;
                beforeEach(() => {
                    post = new Post({});
                });
                it('should reject as impossible', () => {
                    post.unbookmark().should.be.rejectedWith('No can do');
                });
            });
        });
        describe('functions', () => {
            describe('reply()', () => {
                let sandbox = null;
                beforeEach(() => {
                    sandbox = sinon.sandbox.create();
                    forum.Slack.postMessage = sandbox.stub();
                    
                });
                afterEach(() => sandbox.restore());
                it('should resolve to result of Slack.postMessage', () => {
                    const expected = Math.random();
                    forum.Slack.postMessage.resolves(expected);
                    return Post.reply(1, 2, 3).should.become(expected);
                });
                it('should swallow the error for empty message sending', () => {
                    forum.Slack.postMessage.rejects('no_text');
                    return Post.reply(1, 2, 3).should.be.fulfilled;
                });
                it('should report other errors', () => {
                    forum.Slack.postMessage.rejects('too_many_platapuses');
                    return Post.reply(1, 2, 3).should.be.rejectedWith('too_many_platapuses');
                });
            });
            describe('get()', () => {
                it('should reject when there is no such post in history', () => {
                    return Post.get(1).should.be.rejected;
                });
                it('should retrieve posts from history', () => {
                    const fakePost = { text: 'Pretend I am a post'};
                    const id = Post.save(fakePost);
                    return Post.get(id).should.become(fakePost);
                });
            });
            describe('preview()', () => {
                it('should resolve to the input', () => {
                    const content = `a${Math.random()}b`;
                    return Post.preview(content).should.become(content);
                });
            });
            describe('parse()', () => {
                it('should throw error on falsy payload', () => {
                    chai.expect(() => Post.parse()).to.throw('E_POST_NOT_FOUND');
                });
                it('should accept serialized input', () => {
                    Post.parse('{}').should.be.ok;
                });
            });
        });
    });
});
