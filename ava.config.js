export default {
    failFast: true,
    require: [
        '@babel/register',
        '@babel/polyfill',
        './helpers/enzyme.js',
        './helpers/browser-env.js',
    ],
};
