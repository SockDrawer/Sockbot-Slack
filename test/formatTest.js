'use strict';

const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.should();


const testModule = require('../src/Format');
describe('providers/slack/format', () => {
    describe('exports', () => {
        const fns = ['urlForPost', 'urlForTopic', 'quoteText', 'link', 'image', 'spoiler',
            'italic', 'bold', 'bolditalic', 'header1', 'header2', 'header3', 'header4',
            'header5', 'header6', 'preformat', 'strikethrough', 'list'
        ];
        fns.forEach((fn) => {
            it(`should export '${fn}()'`, () => {
                chai.expect(testModule[fn]).to.be.a('function');
            });
        });
        it('should only have expected functions', () => {
            testModule.should.have.all.keys(fns);
        });
    });
    describe('urlForPost()', () => {
        it('should return an empty string', () => {
            const expected = '';
            testModule.urlForPost('honey-badger').should.equal(expected);
        });
    });
    describe('urlForTopic()', () => {
        it('should return an empty string', () => {
            const expected = '';
            testModule.urlForTopic('honey-badger').should.equal(expected);
        });
    });
    describe('quoteText()', () => {
        it('should quote single-line text as expected', () => {
            const input = 'abc';
            const expected = '>abc';
            testModule.quoteText(input).should.equal(expected);
        });
        it('should quote multi-line text as expected', () => {
            const input = 'a\n\n\tb\n \t c';
            const expected = '>>>a\n\n\tb\n \t c';
            testModule.quoteText(input).should.equal(expected);
        });
    });
    describe('headers', () => {
        [
            ['H1', 'header1', 'test text'],
            ['H2', 'header2', 'test text'],
            ['H3', 'header3', 'test text'],
            ['H4', 'header4', 'test text'],
            ['H5', 'header5', 'test text'],
            ['H6', 'header6', 'test text']
        ].forEach((cfg) => {
            it(`should not make a header`, () => {
                testModule[cfg[1]]('test text').should.equal(cfg[2]);
            });
        });
    });
    describe('emphasis', () => {
        [
            ['italic', '_test text_'],
            ['bold', '*test text*'],
            ['bolditalic', '*_test text_*']
        ].forEach((cfg) => {
            it(`should generate ${cfg[0]} text`, () => {
                testModule[cfg[0]]('test text').should.equal(cfg[1]);
            });
        });
    });
    describe('hyperlinks', () => {
        it('should generate link for bare url', () => {
            const expected = 'A link: /some/link';
            testModule.link('/some/link').should.equal(expected);
        });
        it('should generate link with blank link text', () => {
            const expected = 'A link: /some/link';
            testModule.link('/some/link', '').should.equal(expected);
        });
        it('should generate link with link text', () => {
            const expected = 'hi there: /some/link';
            testModule.link('/some/link', 'hi there').should.equal(expected);
        });
    });
    describe('images', () => {
        it('should generate basic image link', () => {
            const expected = '/a.png';
            testModule.image('/a.png').should.equal(expected);
        });
        it('should generate alt text and title text from url', () => {
            const expected = 'https://example.com/some/weird/path/a.png';
            testModule.image('https://example.com/some/weird/path/a.png').should.equal(expected);
        });
        it('should include alt and title text', () => {
            const expected = '/a.png (some text)';
            testModule.image('/a.png', 'some text').should.equal(expected);
        });
    });
    describe('spoilers', () => {
        it('should generate spoiler in lowercase', () => {
            const expected = 'ROT13: wnpxqnjf ybir zl ovt fcuvak bs dhnegm';
            testModule.spoiler('jackdaws love my big sphinx of quartz').should.equal(expected);
        });
        it('should generate spoiler in uppercase', () => {
            const expected = 'ROT13: PJZ swbeq onax tylcuf irkg dhvm'.toUpperCase();
            testModule.spoiler('Cwm fjord bank glyphs vext quiz'.toUpperCase()).should.equal(expected);
        });
        it('should leave punctuation alone', () => {
            const expected = 'ROT13: !@#$%^&*()-_+=?|/{}[]`'.toUpperCase();
            testModule.spoiler('!@#$%^&*()-_+=?|/{}[]`'.toUpperCase()).should.equal(expected);
        });
    });
    describe('preformat', () => {
        it('should generate preformatted text in markdown', () => {
            const expected = '`text`';
            testModule.preformat('text').should.equal(expected);
        });
        it('should generate preformatted text with multiple lines', () => {
            const expected = '```\nline1\nline2\n```';
            testModule.preformat('line1\nline2').should.equal(expected);
        });
        it('should retain existing whitespace', () => {
            const expected = '```\n     line1\n   line2\n```';
            testModule.preformat('     line1\n   line2').should.equal(expected);
        });
    });
    describe('strikethrough', () => {
        it('should generate striken text in markdown', () => {
            const expected = '~~text~~';
            testModule.strikethrough('text').should.equal(expected);
        });
    });
    describe('list', () => {
        it('should generate a  list in slack format', () => {
            const expected = '\n• item1\n• item2\n• item3';
            testModule.list(['item1', 'item2', 'item3']).should.equal(expected);
        });
    });
});
