<template>
    <div id="app">
        <div id="nav">
            <div class="layout" v-if="isSignIn">
                <span  class="btn" v-on:click="logOut">登出</span>
            </div>
            <div class="layout" v-else>
                <span class="btn" v-on:click="showSignUp = true">注册</span>
                <span class="btn" v-on:click="showSignIn = true">登录</span>
            </div>
        </div>
        <div class="layout">
            <el-dialog title="注册" v-model="showSignUp" size="tiny">
                <SignUpForm @success="initUser" @close="showSignUp = false">
                </SignUpForm>
            </el-dialog>
            <el-dialog title="登录" v-model="showSignIn" size="tiny">
                <SignInForm @success="initUser" @close = "showSignIn = false">
                </SignInForm>
            </el-dialog>
            <section id="todo"> 
                <header>
                    <h1 id="header">Hello {{user.username}}</h1>
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input type="text" placeholder="输入待办事项" v-model="newTodo" v-on:keyup.enter="addTodo" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="addTodo">添加</el-button>
                        </el-form-item>
                    </el-form>
                </header>       
                <div id="todos">
                    <el-row v-for="todo in todoList" :gutter="10" class="grid">
                        <el-col :xs="2" :sm="2" :md="2" :lg="2">
                            <div class="grid-content">
                                <el-checkbox v-model="todo.done" v-on:change="handleTodos"></el-checkbox>
                            </div>
                        </el-col>
                        <el-col :xs="6" :sm="6" :md="6" :lg="6">
                            <div class="grid-content">
                                <span class="todo-title">{{todo.title}}</span>
                            </div>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4">
                            <div class="grid-content">
                                <span class="done-or-not" v-if="todo.done">（已完成）</span>
                                <span class="done-or-not" v-else> </span>
                            </div>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" :lg="8">
                            <div class="grid-content">
                                <span class="created-time">创建于{{todo.createTime.month}}月{{todo.createTime.day}}日{{todo.createTime.hour}}时{{todo.createTime.minute}}分</span>
                            </div>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4">
                            <div class="grid-content">
                                <el-button v-on:click="delTodo(todo)">移除</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import AV from './lib/leancloud';
import SignInForm from './components/signInForm'
import SignUpForm from './components/signUpForm'
import getAVUser from './lib/getAVUser'
import saveStorage from './lib/saveStorage'
import getStorage from './lib/getStorage'



export default {
  name: 'app',
  data: ()=>{
    return {
      newTodo: '',
      todoList: [
        //   {
        //     title: this.newTodo,
        //     createTime: {
        //         year: nowTime.getFullYear(),
        //         month: nowTime.getMonth()+1,
        //         day: nowTime.getDate(),
        //         hour: nowTime.getHours(),
        //         minute: nowTime.getMinutes()+1
        //     },
        //     done: false
        //   }
      ],
      showSignIn: false,
      showSignUp: false,
      isSignIn: false,
      user: {
        // username: '',
        // id: '',
        // objId: ''
      }
    }
  },
  components: { SignInForm, SignUpForm},
  created: function() {
    if (AV.User.current()){
      this.initUser();
      this.readTodos();
    }
  },
  methods: {
    readTodos: function(){
        getStorage().then((data)=>{
            if (data){
                this.todoList = data.content;
                this.user.objId = data.objId;
                console.log('User id:',this.user.id);
                console.log('Obj id:',this.user.objId);
            } else {
                console.log('未读取到信息');
            }
        },(error)=>{
            console.error('something wrong',error);
        });
    },
    handleTodos: function (){
        saveStorage(this.todoList,this.user.objId).then((val)=>{
            this.user.objId = val.id;
            console.log('success,obj-id:',this.user.objId);
        },(error)=>{
            console.error('fail')
        });
    },
    addTodo: function (event){
        let nowTime = new Date();
        let newItem = {
            title: this.newTodo,
            createTime: {
                year: nowTime.getFullYear(),
                month: nowTime.getMonth()+1,
                day: nowTime.getDate(),
                hour: nowTime.getHours(),
                minute: nowTime.getMinutes()+1
            },
            done: false
        };
        this.todoList.push(newItem);
        this.newTodo = '';
        this.handleTodos();
    },
    delTodo: function (todo){
        let index = this.todoList.indexOf(todo);
        this.todoList.splice(index,1);
        this.handleTodos();
    },
    initUser: function(){
        this.user = getAVUser();
        this.showSignIn =false;
        this.showSignUp =false;
        this.isSignIn = true;
        this.readTodos();
    },
    logOut: function(){
        AV.User.logOut();
        this.user = {};
        window.location.reload();
    }
  }
}
</script>

<style lang="scss">
* {
    margin: 0;padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
ol,li {
    list-style: none;
}
// #app {
//     margin: 50px auto;

// }

.layout {
    width: 900px;
    margin: 0 auto;
}
#nav {
    height: 3.5em;
    background-color: #20A0FF;
    .layout {
        display: flex;
        height: 100%;
        align-items: center;
        .btn {
            color: #fff;
            color: #fff;
            margin-right: 2em;
            cursor: pointer;
            font-size: 20px;
            &:hover {
                background: #1D8CE0
            }
        }
    }
}
#todo {
    margin-top: 2em;
    #header {
        margin: 1em auto;
        border-bottom: 2px solid #20A0FF;
    }
    #todos {
        .grid {
            margin-top: 1em;
            border-bottom: 1px solid #20A0FF;
            &:last-of-type {
                border-bottom: none;
            }
            .grid-content {
                min-height: 3em;
                display: flex;
                align-items: center;
            }
        }
        
    }
}

</style>
