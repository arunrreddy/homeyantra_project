import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import scrollBehavior from './scroll_behavior';

// 1. Define route components.
import NotFound from 'views/NotFound';
import Home from 'views/Home';
import Report from 'views/Report';
import Success from 'views/Success';

// 2. Define some routes
const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
        meta: { title: 'Product-Demo' }
    },
    {
        path: '/product-report',
        component: Report,
        name: 'report',
        meta: { title: 'Product-Demo' },
        props: true
    },
    {
        path: '/success',
        component: Success,
        name: 'success',
        meta: { title: 'Product-Demo'},
        props: true
    },
    {
        path: '*',
        component: NotFound,
        meta: { hidden: true }
    }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export default new VueRouter({
    mode: 'history',
    // base: __dirname, -> Not sure what this does.
    linkActiveClass: 'is-active',
    scrollBehavior,
    routes // short for routes: routes
});
