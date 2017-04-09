<template>
    <el-form @submit.prevent="signIn">
        <el-form-item label="用户名">
            <el-input type="text" v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="signIn">登录</el-button>
            <el-button @click="close">取消</el-button>     
        </el-form-item>
        <span class="errorMessage">{{errorMessage}}</span>
    </el-form>
</template>

<script>
    import AV from '../lib/leancloud'
    import getErrorMessage from '../lib/getErrorMessage'

    export default {
        name: 'SignInForm',
        data(){
            return {
                formData: {
                    username: '',
                    password: ''
                },
                errorMessage: ''
            }
        },
        methods: {
            signIn(){
                let {username,password} = this.formData;
                AV.User.logIn(username,password).then(()=>{
                    this.$emit('success')
                },(error)=>{
                    this.errorMessage = getErrorMessage(error);
                });
            },
            close(){
                this.$emit('close');
                this.formData.username = '';
                this.formData.password = '';
                
            }
        }
    }
</script>
