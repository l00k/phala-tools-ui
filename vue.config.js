const webpack = require('webpack');
const moment = require('moment');


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
    return 'v' + moment().format('YYYY.MM.DD.HHmmss') + '-' + random;
}

const env = process.env.NODE_ENV || 'production';
const isDev = env !== 'production';


module.exports = {
    runtimeCompiler: true,
    css: {
        sourceMap: isDev,
        extract: false,
        
        loaderOptions: {
            css: {
                sourceMap: isDev,
            },
            sass: {
                prependData: `
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
        if (isDev) {
            config.devtool = 'source-map';
        }
        
        config.optimization.minimize = false;
        config.devServer = {
            port: 4001,
            allowedHosts: [
                '.ngrok.io',
            ],
            headers: {
                'Access-Control-Allow-Origin': '*',
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
        const buildVersion = generateUniqueBuildInfo();
        const appData = JSON.stringify({ buildVersion });
        
        config.plugins.push(
            new webpack.DefinePlugin({
                __APP_DATA__: JSON.stringify(appData)
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
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compiler = require('vue-template-babel-compiler');
                return options;
            });
        
        config.module
            .rule('js')
            .test(/\.js$/)
            .use('@open-wc/webpack-import-meta-loader')
            .loader('@open-wc/webpack-import-meta-loader');
    }
};
