module.exports = function parse(argv) {
    var options = require('argly')
        .createParser({
            '--help': {
                type: 'string',
                description: 'Show this help message'
            },
            '--server': {
                type: 'boolean',
                description: 'Run only server tests'
            },
            '--browser': {
                type: 'boolean',
                description: 'Run only browser tests'
            },
            '--files --file -f *': {
                type: 'string[]',
                description: 'File patterns'
            }
        })
        .usage('Usage: $0 [options]')
        .example(
            'First example',
            '$0 src/components/')
        .example(
            'Second example',
            '$0 --foo hello --bar world')
        .validate(function(result) {
            if (result.help) {
                this.printUsage();
                process.exit(0);
            }
        })
        .onError(function(err) {
            this.printUsage();
            console.error(err);
            process.exit(1);
        })
        .parse(argv);

    var patterns = options.files;

    if (options.server == null) {
        if (options.browser == null) {
            options.server = options.browser = true;
        } else {
            options.server = options.browser !== true;
        }
    }

    if (options.browser == null) {
        options.browser = options.server !== true;
    }

    if (!patterns || !patterns.length) {
        patterns = ['**/test/*.js'];
    }

    options.patterns = patterns;
    delete options.files;

    return options;
};