'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

const sinon = require('sinon');
require('sinon-as-promised');
chai.use(require('sinon-chai'));

const topicModule = require('../src/Topic');

describe('providers/nodebb/topic', () => {
    it('should export bindTopic()', () => {
        topicModule.bindTopic.should.be.a('function');
    });

    it('should return a class on call to bindTopic()', () => {
        topicModule.bindTopic({}).should.be.a('function');
    });

    describe('Topic', () => {
        const forum = {
            Slack: {
                postMessage: sinon.stub().resolves(),
                _api: sinon.stub(),
                getChannel: sinon.stub()
            }
        };
        
        const Topic = topicModule.bindTopic(forum);
        let topic;
        
        beforeEach(() => {
            forum._emit = sinon.stub().resolves();
            forum._emitWithRetry = sinon.stub().resolves();
            forum.fetchObject = sinon.stub().resolves();
            topic = new Topic({
                creator: 'Goddess',
                name: 'Seven Days',
                created: new Date().toDateString(),
                id: 123
            });
        });
        describe('ctor()', () => {
            
        });
        
        it('should allow replying', () => {
            forum.Slack.postMessage.reset();
            return topic.reply('the little mermaid').then(() => {
                forum.Slack.postMessage.should.have.been.calledWith(123, 'the little mermaid');
            });
        });
        
        it('should allow joining', () => {
            forum.Slack._api.resolves({ ok: true });
            return topic.join().then(() => {
               forum.Slack._api.should.have.been.calledWith("channels.join", {
                   name: 'Seven Days'
               });
            });
        });
        
        it('should report errors when joining', () => {
            forum.Slack._api.resolves({ ok: 'Error occurred' });
            return topic.join().should.be.rejectedWith('Error occurred');
        });
        
        
        it('should allow parting', () => {
            forum.Slack._api.resolves({ ok: true });
            return topic.part().then(() => {
               forum.Slack._api.should.have.been.calledWith("channels.leave", {
                   name: 'Seven Days'
               });
            });
        });
        
        it('should report errors when parting', () => {
            forum.Slack._api.resolves({ ok: 'Error occurred' });
            return topic.part().should.be.rejectedWith('Error occurred');
        });
        
        context('Aliases', () => {
            beforeEach(() => {
               sinon.stub(topic, 'join').resolves();
               sinon.stub(topic, 'part').resolves();
            });

            it('should alias watch to join', () => {
                return topic.watch().then(() => topic.join.should.have.been.called);
            });
            
            it('should alias unwatch to part', () => {
                return topic.unwatch().then(() => topic.part.should.have.been.called);
            });
            
            it('should alias unmute to join', () => {
                return topic.unmute().then(() => topic.join.should.have.been.called);
            });
            
            it('should alias mute to part', () => {
                return topic.mute().then(() => topic.part.should.have.been.called);
            });
        });
        
        context('impossible functions', () => {
            const expect = chai.expect;
            it('should not give a URL', () => expect(topic.url).to.throw('Not possible')); 
            it('should not give latest posts', () => expect(topic.getLatestPosts).to.throw('I can\'t let you do that, dave')); 
            it('should not give all posts', () => expect(topic.getAllPosts).to.throw('I can\'t let you do that, dave')); 
        });
        
        context('static functions', () => {
            it('should provide a getter for topics', () => {
               forum.Slack.getChannel.resolves({
                    creator: 'Arwen',
                    name: 'Yggdrasil',
                    created: new Date().toDateString(),
                    id: 456
               });
               return Topic.get(456).then((t) => {
                   forum.Slack.getChannel.should.have.been.calledWith(456);
                   t.authorId.should.equal('Arwen');
                   t.title.should.equal('Yggdrasil');
               });
            });
        });
    });
});
