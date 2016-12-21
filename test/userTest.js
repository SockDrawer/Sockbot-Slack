'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

const sinon = require('sinon');
require('sinon-as-promised');
chai.use(require('sinon-chai'));

const userModule = require('../src/User');

describe('providers/nodebb/user', () => {
    it('should export bindUser()', () => {
        userModule.bindUser.should.be.a('function');
    });

    it('should return a class on call to bindUser()', () => {
        userModule.bindUser({}).should.be.a('function');
    });

    describe('User', () => {
        const forum = {
            Slack: {
                _api: sinon.stub()
            }
        };
        
        const User = userModule.bindUser(forum);
        let user;
        
        beforeEach(() => {
            forum._emit = sinon.stub().resolves();
            forum._emitWithRetry = sinon.stub().resolves();
            forum.fetchObject = sinon.stub().resolves();
            user = new User({
                id: '12345',
                name: 'Gladriel',
                real_name: 'Gladriel the Golden',
                profile: {
                    email: 'GoldenHairedMaiden@theRiverbank.com'
                }
            });
        });
        
        context('impossible functions', () => {
            const expect = chai.expect;
            it('should not give a URL', () => expect(user.url()).to.be.rejectedWith('Not applicable')); 
            it('should not allow following users', () => expect(user.follow()).to.be.rejectedWith('Stalker no stalking!')); 
            it('should not allow unfollowing users', () => expect(user.unfollow()).to.be.rejectedWith('Stalker no stalking!')); 
        });
        
        context('static functions', () => {
            let susan; //go to heaven with her siblings :kappa:
            
            before(() => {
                susan = {
                    id: '4567',
                    name: 'Susan',
                    real_name: 'Queen Susan the Wise',
                    profile: {
                        email: 'QueenSusan@narnia.gov'
                    }
                };
                
                forum.Slack._api.resolves({
                    user: susan
                });
                forum.Slack.getUser = sinon.stub().resolves(susan);
            });
            
            it('should provide a getter for users', () => {
                return User.get('4567').then((u) => {
                    forum.Slack._api.should.have.been.calledWith('users.info', { user: '4567'});
                    u.username.should.equal('Susan');
                    u.name.should.equal('Queen Susan the Wise');
                    u.email.should.equal('QueenSusan@narnia.gov');
                });
            });
            
            it('should provide a getter for users by name', () => {
                return User.getByName('Susan').then((u) => {
                    forum.Slack.getUser.should.have.been.calledWith('Susan');
                    u.username.should.equal('Susan');
                    u.name.should.equal('Queen Susan the Wise');
                    u.email.should.equal('QueenSusan@narnia.gov');
                });
            });
            
            it('should provide a parser for user payloads', () => {
                const u = User.parse(susan);
                u.username.should.equal('Susan');
                u.name.should.equal('Queen Susan the Wise');
                u.email.should.equal('QueenSusan@narnia.gov');
            });
        });
    });
});
