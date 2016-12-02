'use strict';

const formatter = {
    urlForPost: () => {
        return '';
    },
    
    urlForTopic: () => {
        return '';
    },
    
    /**
     * Turn input text into a quote. No attribution is possible in this provider
     *
     * @param {!string} text Text to quote
     * @returns {string} quoted text
     */
    quoteText: (text) => {
        let lines = text.split('\n');
        let output;
        for (let i = 0; i < lines.length; i++) {
            output += '> ' + lines[i] + '\n';
        }
        
        return output;
    },
    
     /**
     * Geenerates a link
     *
     * @param {!string} url URL
     * @param {string} text The text to display
     * @returns {string} A string directing the user to click the link
     */
    link: (url, text) => {
        text = text || 'A link';
        return `${text}: ${url}`
    },
    
    /**
     * Links to an image
     *
     * @param {!string} url Image URL
     * @param {string} titleText Title text to display
     * @returns {string} A string directing the user to click the link to view the image
     */
    image: (url, alt) => {
        if (alt) {
            return `${url} (${alt})`;
        } else {
            return url;
        }
    },
    
    /**
     * Formats a spoiler as rot13, since there's no spoiler format
     *
     * @param {!string} text Input text
     * @returns {string} The input as rot13
     */
    spoiler: (input) => {
        //ROT13 :D
        let output = input.split('').map((c) => {
            let codePoint = c.charCodeAt(0);
            if ((codePoint >= 78 && codePoint <= 90)
                || (codePoint >= 110 && codePoint <= 122)) {
                codePoint -= 13;
            }
            else if ((codePoint >= 65 && codePoint <= 77)
                || (codePoint >= 97 && codePoint <= 109)) {
                codePoint += 13;
            }
            
            return String.fromCharCode(codePoint);
        }).join('');
        
        return `ROT13: ${output}`;
    },
    
    /**
     * Format text as bold.
     *
     * @param {!string} text Input text
     * @returns {string} Bolded Text
     */
    bold: (input) => {
        return `*${input}*`;
    },
    
    /**
     * Format text as italic.
     *
     * @param {!string} text Input text
     * @returns {string} Italiced Text
     */
    italic: (input) => {
        return `_${input}_`;
    },
    
    /**
     * Format text as bold italic.
     *
     * @param {!string} text Input text
     * @returns {string} Bolded and italiced Text
     */
    bolditalic: (input) => {
        return formatter.bold(formatter.italic(input));
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header1: (input) => {
        return input;
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header2: (input) => {
        return input;
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header3: (input) => {
        return input;
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header4: (input) => {
        return input;
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header5: (input) => {
        return input;
    },
    
    /**
     * Fails to format text as a header, as slack supports no such thing
     *
     * @param {!string} text Header text
     * @returns {string} Headered Text
     */
    header6: (input) => {
        return input;
    },
    
    /**
     * Format text as a preformatted block
     *
     * @param {!string} text The text
     * @returns {string} Text in a preformat block
     */
     /* eslint-disable prefer-template */
    preformat: (text) => {
        if (text.indexOf('\n') > -1) {
            return '```\n' + text + '\n```';
        }
        return '`' + text + '`';
    },
    
    /* eslint-enable prefer-template */
    
    /**
     * Format text with a strikethrough effect
     *
     * @param {!string} text The text to strike out
     * @returns {string} The stricken text
     */
    strikethrough: (text) => {
        return `~~${text}~~`;
    },

    /**
     * Format text as a list of items
     *
     * @param {!Array} items An array of strings to format as a list
     * @returns {string} The list
     */
    list: (items) => {
        return items.map((item) => `\n• ${item}`).join('');
    }
};

module.exports = formatter;