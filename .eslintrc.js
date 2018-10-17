module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jasmine": true,
        "node": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "no-unused-vars": [
            "warn",
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals": {
        "require": true
    }
};
