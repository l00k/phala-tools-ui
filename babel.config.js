module.exports = {
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            { 'legacy': true }
        ],
        [
            '@babel/plugin-proposal-class-properties'
        ],
        '@babel/plugin-proposal-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
    ],
    presets: [
        '@vue/cli-plugin-babel/preset',
    ]
};
