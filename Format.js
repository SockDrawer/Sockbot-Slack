'use strict';

const formatter = {
    urlForPost: () => {
        return '';
    },
    
    urlForTopic: () => {
        return '';
    },
    
    quoteText: (text) => {
        let lines = text.split('\n');
        let output;
        for (let i = 0; i < lines.length; i++) {
            output += '> ' + lines[i] + '\n';
        }
        
        return output;
    },
    
    link: (url, text) => {
        text = text || 'A link';
        return `${text}: ${url}`
    },
    
    image: (url, alt) => {
        if (alt) {
            return `${url} (${alt})`;
        } else {
            return url;
        }
    },
    
    spoiler: (input) => {
        return input;
    },
    
    bold: (input) => {
        return `*${input}*`;
    },
    
    italic: (input) => {
        return `_${input}_`;
    },
    
    boldItalic: (input) => {
        return formatter.bold(formatter.italic(input));
    },
    
    header1: (input) => {
        return input;
    },
    
    header2: (input) => {
        return input;
    },
    
    header3: (input) => {
        return input;
    },
    
    header4: (input) => {
        return input;
    },
    
    header5: (input) => {
        return input;
    },
    
    header6: (input) => {
        return input;
    }
}

module.exports = formatter;