<template>
    <main style="margin-top:50px;">
        <el-row>
            <div class="demo text-center">Add Inventory</div>
        </el-row>
        <br>
        <br>
        <el-col :span="12" :offset="6">
            <el-form ref="productForm" :model="productForm" :rules="rules" label-width="200px" label-position="left">
                <el-form-item style="margin-bottom: 40px;" label="Product Id" prop="product_id">
                    <el-col :span="23">
                        <el-input :maxlength=60 name="product_id" v-model="productForm.product_id" type="text"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" label="Product Type" prop="product_type_id">
                    <el-col :span="23">
                        <el-select v-model="productForm.product_type_id" placeholder="Select Product Type"
                    clearable>
                            <el-option v-for='productType in productTypes' :label="productType.name" :name="productType.id"
                            :value="productType.id" :key="productType.id" class="select-items">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" label="Product Name" prop="product_name">
                    <el-col :span="23">
                        <el-input name="product_name" v-model="productForm.product_name" type="text"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Price" prop="price">
                    <el-col :span="23">
                        <el-input name="price" v-model="productForm.price" type="text"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Image Url" prop="image_url">
                    <el-col :span="23">
                        <el-input name="image_url" v-model="productForm.image_url" type="text"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Quantity" prop="quantity">
                    <el-col :span="23">
                        <el-input name="quantity" v-model="productForm.quantity" type="text"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-col class="text-center" style="margin-top: 50px;">
                <el-button type="primary" size="large" @click="onSubmit" @keyup.native.enter="onSubmit">Submit</el-button>
                <el-button type="primary" size="large" @click="resetForm">Reset</el-button>
                <router-link :to="{name: 'report'}" style="text-decoration:none;color: white;float:right;">
                    <el-button type="primary" size="large">
                        View Inventory
                    </el-button>
                </router-link>
            </el-col>

        </el-col>
    </main>
</template>

<script>
// eslint-disable-next-line no-shadow
import { Message, Form, FormItem, Input, Button, Col, Row, Select, Option } from 'element-ui';

import { responseHelper, defaultCatch } from 'lib/util';
import * as apiClient from 'lib/api_client';

const debug = require('debug')('product_demo:home');

export default {
    name: 'home',
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Button.name]: Button,
        [Message.name]: Message,
        [Col.name]: Col,
        [Row.name]: Row,
        [Select.name]: Select,
        [Option.name]: Option
    },
    data() {
        const numericValue = (rule, value, callback) => {
            if (isNaN(value)) {
                return callback('Input is not a number');
            }
            callback();
        };
        const validImageString = (rule, value, callback) => {
            if(!value.match(/\.(jpeg|jpg|gif|png)$/)){
                return callback('Please enter a valid image url');
            }
            callback();
        };
        const validType = (rule, value, callback) => {
            if(isNaN(value)){
                return callback('Please select a valid option');
            } else if(!(value in ['1', '2', '3', '4'])) {
                return callback('Please select a valid option');
            }
            callback();
        };
        return {
            productForm: {
                product_id: '',
                product_type_id: null,
                product_name: '',
                price: '',
                image_url: '',
                quantity: ''
            },
            // When more product types added get all types from DB on creation of page
            productTypes: [
                {
                    id: '1',
                    type: 'tv',
                    name: 'Television'
                },
                {
                    id: '2',
                    type: 'fridge',
                    name: 'Refrigerator'
                },
                {
                    id: '3',
                    type: 'ac',
                    name: 'Air conditioner'
                },
                {
                    id: '4',
                    type: 'washingmachine',
                    name: 'Washing Machine'
                }
            ],
            rules: {
                product_id: [
                    {required: true, message: 'Product Id is required', trigger: 'blur'}
                ],
                product_type_id: [
                    {
                        required: true, message: 'Product Type is required', trigger: 'blur'
                    },
                    {
                        validator: validType, trigger: 'blur'
                    }
                ],
                product_name: [
                    {
                        required: true, message: 'Product Name is required', trigger: 'blur'
                    }
                ],
                price: [
                    {
                        required: true, message: 'Price is required', trigger: 'blur'
                    },
                    {
                        validator: numericValue, trigger: 'change, blur'
                    }
                ],
                image_url: [
                    {
                        required: true, message: 'Image url is required', trigger: 'blur'
                    },
                    {
                        validator: validImageString, trigger: 'blur'
                    }
                ],
                quantity: [
                    {
                        required: true, message: 'Quantity is required', trigger: 'blur'
                    },
                    {
                        validator: numericValue, trigger: 'change, blur'
                    }
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            const productFormRef = this.$refs.productForm;
            productFormRef.validate(valid => {
                if (valid) {
                    apiClient.storeProduct(this.productForm)
                       .then(responseHelper(
                           (response, message) => {
                               debug('Response: ', response);
                               this.$router.push({
                                   name: 'success',
                                   params: {
                                       productId: response.productId,
                                       message
                                   }
                               });
                           },
                           message => {
                               Message.error({message, duration: 3000 });
                               this.resetForm();
                           }
                    )).catch(defaultCatch);
                }
            });
        },
        resetForm(){
            debug('Resetting the form');
            this.productForm = {
                product_id: '',
                product_type_id: null,
                product_name: '',
                price: '',
                image_url: '',
                quantity: ''
            };
        }
    }
};

</script>

<style scoped>

.text-center {
    text-align: center;
}

.demo {
    font-size: 37px;
    font-weight: 3000;
    font-family: 'Open Sans', sans-serif;
    color: #e75e00;
}

</style>
