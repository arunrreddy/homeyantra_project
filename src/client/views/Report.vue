<template>
    <main style="margin-top:50px">
        <el-row>
            <el-col :span="24">
                <div class="demo">Product Listing</div>
            </el-col>
        </el-row>
        <br/>
        <el-row class="score-container" v-if="!loading && products">
            <el-table :data="products" border style="width: 100%">
                <el-table-column prop="product_id" label="Product Id">
                </el-table-column>
                <el-table-column prop="product_type" label="Product Type" :filters="filters" :filterMethod="filterProducts">
                </el-table-column>
                <el-table-column prop="product_name" label="Product Name">

                </el-table-column>
                <el-table-column prop="price" label="Price" sortable>

                </el-table-column>
                <el-table-column prop="image_url" label="Image Url">

                </el-table-column>
                <el-table-column prop="quantity" label="Quantity" sortable></el-table-column>
            </el-table>
        </el-row>
        <el-row class="score-container" v-if="!loading && !products">
            <span>No products found</span>
        </el-row>
        <el-row>
            <router-link :to="{name: 'home'}" style="text-decoration:none;color:white;">
                <el-button type="primary">
                    Add More Products
                </el-button>
            </router-link>
        </el-row>
    </main>
</template>

<script>
import { Message, Row, Col, Table, TableColumn, Button } from 'element-ui';
import { defaultCatch, responseHelper } from 'lib/util';
import * as apiClient from 'lib/api_client';

const debug = require('debug')('product_demo:report');

export default {
    name: 'report',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Button.name]: Button
    },
    computed: {

    },
    data() {
        return {
            products: [],
            loading: false,
            filters: [
                { text: 'Washing Machine', value: 'Washing Machine' },
                { text: 'Air Conditioner', value: 'Air Conditioner' },
                { text: 'Television', value: 'Television' },
                { text: 'Refrigerator', value: 'Refrigerator' }
            ]
        };
    },
    created() {
        this.fetchReport();
    },
    methods: {
        fetchReport() {
            debug('Getting product list');
            this.loading = true;
            apiClient.getProducts()
                .then(responseHelper(
                    response => {
                        this.products = response.products;
                        this.loading = false;
                    },
                    message => { // On Failure
                        Message.error({ message, duration: 3000 });
                        this.loading = false;
                    }
                ))
                .catch(defaultCatch);

        },
        filterProducts(filter, product) {
            debug(product.product_type);
            debug(filter);
            debug(product.product_type === filter);
            return product.product_type === filter;
        }
    }
};

</script>

<style scoped>
.demo {
    font-size: 37px;
    font-weight: 3000;
    font-family: 'Open Sans', sans-serif;
    color: #e75e00;
    text-align: center;
}

.score-head {
    font-size: 20px;
    font-weight: 500;
    color: #4a4a4a;
    margin-top: 35px;
    margin-bottom: 35px;
}

.scores {
    font-size: 50px;
    font-weight: 500;
    font-family: 'Fjalla One', 'Open Sans', sans-serif;
}

.high-score {
    color: #20b519;
}

.low-score {
    color: #d85c6b;
}

.boolean-score {
    color: #4a4a4a;
}

.sign-up {
    border-radius: 4px;
    border: solid 2px #e75e00;
    padding: .5em 1em;
    color: #e75e00;
    font-weight: bold;
    text-decoration: none;
    text-transform: uppercase;
}

.score-text {
    font-size: 16px;
    font-weight: 500;
    color: #4a4a4a;
    text-transform: uppercase;
    font-family: 'Fjalla One', 'Open Sans', sans-serif;
    margin-top: 10px;
}

.text-right {
    text-align: right;
}

.score-container {
    margin-bottom: 2%;
}

.text-center {
    text-align: center;
}

.score-text-font-family {
    font-family: 'Fjalla One', 'Open Sans', sans-serif;
}

</style>
