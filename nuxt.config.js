export default {

    ssr: false,

    /*
     ** Headers of the page
     ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
     */
    head: {
        title: "Tattoo Shop",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            {
                hid: "description",
                name: "description",
                content: "Nuxt.js Vuetify starter for CodeSandBox"
            }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    /*
     ** Global CSS
     ** Doc: https://nuxtjs.org/api/configuration-css
     */
    css: [],

    /*
     ** Plugins to load before mounting the App
     ** Doc: https://nuxtjs.org/guide/plugins
     */
    plugins: [],

    /*
     ** Nuxt.js modules
     ** Doc: https://nuxtjs.org/guide/modules
     */
    modules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],

    // Doc: https://github.com/nuxt-community/vuetify-module
    vuetify: {
        customVariables: ["~/assets/variables.scss"],
        optionsPath: "./vuetify.options.js"
    },

    router: {
        middleware: ['auth'],
    },

    auth: {
        strategies: {
            local: {
                token: {
                    property: "accessToken", //property name that the Back-end sends for you as a access token for saving on localStorage and cookie of user browser
                    global: true,
                    required: true,
                    type: "Bearer"
                },
                endpoints: {
                    login: { url: 'login', method: 'post', propertyName: 'accessToken' },
                    user: { url: 'me', method: 'get', propertyName: 'data' },
                    logout: false
                }
            }
        },
        plugins: ['~/plugins/auth.js'],
        redirect: {
            login: '/login',
            logout: '/login',
            user: '/profile',
            callback:'/'
        }
    },

    axios: {
        baseURL: 'http://localhost:3005/api', // Used as fallback if no runtime config is provided
    },
};
