const webpack = require('webpack');
const moment = require('moment');
const path = require('path');


class IntiPathResolverPlugin
{
    static MODULES_PATH = __dirname + '/src/modules/';
    
    constructor (source, target)
    {
        this.source = source || 'resolve';
        this.target = target || 'resolve';
    }
    
    apply (resolver)
    {
        var target = resolver.ensureHook(this.target);
        resolver
            .getHook(this.source)
            .tapAsync('IntiPathResolverPlugin', (request, resolveContext, callback) => {
                if (request.request[0] === '#') {
                    request.request = request.request.replace('#/', IntiPathResolverPlugin.MODULES_PATH);
                    return resolver.doResolve(target, request, null, resolveContext, callback);
                }
                callback();
            });
    }
}


function generateUniqueBuildInfo ()
{
    const date = new Date();
    const random = 100 + Math.round(Math.random() * 899);
    return 'v' + moment.utc().format('YYYY.MM.DD.HHmmss') + '-' + random;
}

const env = process.env.NODE_ENV || 'production';
const isDev = env !== 'production';

const appVariant = process.env.APP_VARIANT === 'khala'
    ? 'khala'
    : 'phala';


module.exports = {
    runtimeCompiler: true,
    lintOnSave: true,
    productionSourceMap: false,
    css: {
        sourceMap: isDev,
        extract: false,
        
        loaderOptions: {
            css: {
                sourceMap: isDev,
            },
            sass: {
                prependData: `
                    $appVariant: ${appVariant};
                    @import "@/assets/scss/theme/_variables.scss";
                `,
                sourceMap: isDev,
            }
        },
    },
    transpileDependencies: [
        /@polkadot\/*/,
        'vuex-module-decorators',
    ],
    configureWebpack (config)
    {
        config.devtool = isDev
            ? 'source-map'
            : undefined;
        
        config.optimization.minimize = false;
        config.devServer = {
            port: 4001,
            allowedHosts: [
                '.ngrok.io',
            ],
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            overlay: {
                warnings: true,
                errors: true
            },
        };
        
        // SETUP PLUGINS
        
        // path resolving
        config.resolve.plugins = [
            new IntiPathResolverPlugin()
        ];
        
        // strip moment locales
        config.plugins.push(
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        );
        
        // global variables
        const appData = JSON.stringify({
            dev: isDev,
            appVariant,
            buildVersion: generateUniqueBuildInfo(),
        });
        
        config.plugins.push(
            new webpack.DefinePlugin({
                __APP_DATA__: JSON.stringify(appData),
            })
        );
        
        // dev plugins
        // config.plugins.push(
        //     new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
        // );
        
        // CONFIGURE RULES
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });
    },
    chainWebpack (config)
    {
        // esnext features in vue files
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compiler = require('vue-template-babel-compiler');
                return options;
            });
        
        // custom public directories
        const publicDir = `public/${appVariant}`;
        
        config.plugin('html')
            .tap((args) => {
                args[0].template = path.resolve(publicDir, 'index.html');
                return args;
            });
        config.plugin('copy')
            .use(require('copy-webpack-plugin'))
            .tap((args) => {
                return [
                    [...(args[0] ? args[0] : []), { from: path.resolve(publicDir) }],
                ]
            })
    }
};
