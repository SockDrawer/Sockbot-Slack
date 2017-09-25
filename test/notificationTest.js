'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.should();

const sinon = require('sinon');
require('sinon-as-promised');


const notifyModule = require('../src/Notifications');

describe('providers/nodebb/notifications', () => {
    it('should export bindNotification()', () => {
        notifyModule.bindNotification.should.be.a('function');
    });

    it('should return a class on call to bindNotification()', () => {
        notifyModule.bindNotification({}).should.be.a('function');
    });
    
    describe('Notification', () => {
        const fakeCommand = {
            execute: sinon.stub().resolves()
        };
        const forum = {
            userId: 'yamibot',
            Slack: {
                _api: sinon.stub(),
                on: sinon.stub(),
                off: sinon.stub()
            },
            Post: {
                parse: sinon.stub(),
                save: sinon.stub(),
                reply: sinon.stub()
            },
            User: {
                get: sinon.stub()
            },
            Topic: {
                get: sinon.stub()
            },
            Commands: {
                get: sinon.stub().resolves(fakeCommand)
            }
        };
        
        const Notification = notifyModule.bindNotification(forum);
        let notif;
        
        beforeEach(() => {
            
            forum.emit = sinon.stub().resolves();
            forum.emitWithRetry = sinon.stub().resolves();
            forum.fetchObject = sinon.stub().resolves();
            
            notif = new Notification({
                text: 'This is a chat message'
            });
        });
        
        context('instance methods', () => {
            it('should return the message', () => 
                notif.getText().should.eventually.equal('This is a chat message'));
                
            it('should provide the post object', () => {
                const fakePost = {
                    id: 3414141
                };
                forum.Post.parse.reset().returns(fakePost);
                notif = new Notification({
                    text: 'This is a chat message'
                });
                return notif.getPost().should.eventually.deep.equal(fakePost); 
            });
                
            it('should provide the user object', () => {
                const fakeUser = {
                    id: 4326545
                };
                forum.User.get.resolves(fakeUser);
                return notif.getUser().should.eventually.deep.equal(fakeUser); 
            });
            
            it('should provide the topic object', () => {
                const fakeTopic = {
                    id: 32543
                };
                notif._post.topicId = 32543;
                forum.Topic.get.resolves(fakeTopic);
                return notif.getTopic().should.eventually.deep.equal(fakeTopic); 
            });
        });
    
        context('message bus', () => {
            let notifyHandler;
            
            before(() => {
                forum.emit = sinon.stub().resolves();
                forum.Slack.on = function(_, handler) {
                    notifyHandler = handler;
                };
                return Notification.activate().then(() => {
                    forum.Slack.on = sinon.stub().resolves();
                });
            });
            
            it('should listen on activate', () => {
               return Notification.activate().then(() => {
                   forum.Slack.on.should.have.been.calledWith('message');
               });
            });
            
            it('should stop listening on deactivate', () => {
               return Notification.deactivate().then(() => {
                   forum.Slack.off.should.have.been.calledWith('message');
               });
            });
           
            it('should ignore unknown types of messages', () => {
                sinon.spy(Notification, 'parse');
                return notifyHandler({
                   type: 'mxyzptlk'
                }).then(() => {
                   Notification.parse.should.not.have.been.called;
                   Notification.parse.restore();
                });
            });
            
            it('should emit for known types of messages', () => {
                sinon.spy(Notification, 'parse');
                forum.emit.reset();
                forum.Post.parse.returns({
                    topicId: 234
                });
                
                return notifyHandler({
                   type: 'message'
                }).then(() => {
                   Notification.parse.should.have.been.called;
                   forum.emit.should.have.been.calledWith('notification:notification');
                   forum.emit.should.have.been.calledWith('notification');
                   Notification.parse.restore();
                });
            });
            
            it('should detect mentions', () => {
                forum.emit.reset();
                forum.Post.parse.returns({
                    topicId: 234
                });
                
                return notifyHandler({
                   type: 'message',
                   text: 'hey @yamibot, how you doin?'
                }).then(() => {
                   forum.emit.should.have.been.calledWith('notification:mention');
                   forum.emit.should.have.been.calledWith('notification');
                });
            });
        });
    });

});
