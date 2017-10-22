<template>
    <main style="margin: 0 auto;">
        <div style="text-align:center;">
            <div style="margin-top: 100px;font-size: 30px;color: green">{{message}} for product with id: {{productId}}</div>
            <router-link :to="{name: 'report'}" style="text-decoration:none;color: white;">
                <el-button type="primary" size="large" style="margin-top: 30px">
                    Inventory
                </el-button>
            </router-link>
        </div>
    </main>
</template>
<script>
import {Button} from 'element-ui';
const debug = require('debug')('product-demo:success');

export default {
    name: 'success',
    components: {
        [Button.name]: Button
    },
    created(){
        debug('Component Created!');
    },
    props: ['productId', 'message']
};
</script>
