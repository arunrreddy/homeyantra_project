<template>
    <div id="main" class="main main-width">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>

const debug = require('debug')('demo:app');

export default {
    name: 'app',
    components: {},
    created() {
        debug('App Created!');
    }
};

</script>

<style>
@media (max-width: 1280px) {
    .main-width {
        width: 960px;
    }
}

@media (min-width: 1281px) and (max-width: 1440px) {
    .main-width {
        width: 1280px;
    }
}

@media (min-width: 1441px) {
    .main-width {
        width: 1440px;
    }
}

.main {
    font-family: 'Open Sans', sans-serif !important;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    margin: auto;
}

.text-center {
    text-align: center;
}

.keep-center {
    width: 50%;
    margin: 0 auto;
}

.full-width {
    width: 100%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}

.hidden {
    display: hidden;
}

.float-right {
    float: right;
}

.small-offset {
    margin-left: 2%;
}

.medium-offset {
    margin-left: 4%;
}

.main-heading {
    font-size: 20px;
    font-weight: 500;
    color: #4a4a4a;
    margin-top: 35px;
    margin-bottom: 35px;
}

.sub-heading {
    font-size: 16px;
    font-weight: 500;
    color: #4a4a4a;
    margin-top: 5px;
    margin-bottom: 5px;
}

.app-font {
    font-family: 'Open Sans', sans-serif;
}

</style>

<style scoped>

</style>
