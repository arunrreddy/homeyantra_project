import _ from 'lodash';

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
// https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js
export default function scrollBehavior(to, from, savedPosition) { // eslint-disable-line require-jsdoc
    if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        return savedPosition;
    }
    const position = {};
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
        position.selector = to.hash;
    }
    // check if any matched route config has meta that requires scrolling to top
    // Do not use shorthand. Does not work after minification.
    if (_.some(to.matched, route => route.meta.scrollToTop)) {
        // cords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0;
        position.y = 0;
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position;
}
