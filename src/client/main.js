// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'whatwg-fetch';
import Vue from 'vue';
import './promise-polyfill';
// import { Loading, Message } from 'element-ui';

import router from './router'; // vue-router instance
import App from './App';
import loadPolyfills from './polyfills';

// Vue.use(Loading);
// Vue.use(Message);

Vue.config.productionTip = false;

// http://stackoverflow.com/questions/31721250/how-to-target-windows-10-edge-browser-with-javascript
// TypeMismatch Error fix https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7528873/
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/
if (window.navigator.userAgent.indexOf('Edge') > 0) {
    delete window.fetch;
}

/**
 * Initialize the application. To be used after required polyfills are loaded
 */
function initialize() {
    // Create and mount the root instance.
    // Make sure to inject the router with the router option to make the
    // whole app router-aware.
    /* eslint-disable no-new */
    // With runtime build
    new Vue({
        // el: '#app',
        router,
        render: h => h(App)
    }).$mount('#app');

    // With Standalone build
    // new Vue({
    //     el: '#app',
    //     template: '<App/>',
    //     components: { App }
    // });
}

loadPolyfills(initialize);
