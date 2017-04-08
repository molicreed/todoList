<template>
  <div id="app">
    <div id="nav">
        <div class="layout">
            <div class="logIn" v-if="isSignIn">
                <span>{{user.username}}</span>
                <span class="btn" v-on:click="logOut">登出</span>
            </div>
            <div class="logOut" v-else>
                <span class="btn" v-on:click="actionType = 'signUp'">注册</span>
                <span class="btn" v-on:click="actionType = 'signIn'">登录</span>
            </div>
        </div>
    </div>
    <div class="layout">
      <MyDialog title="注册" 
            :visible="actionType === 'signUp'" 
            @close="actionType = 'none'">
            <SignUpForm @success="initUser($event)"/>
        </MyDialog>
        <MyDialog title="登录" 
            :visible="actionType === 'signIn'" 
            @close="actionType = 'none'">
            <SignInForm @success="initUser($event)"/>
        </MyDialog>
        <section id="todo"> 
            <header>
                <h1 id="header">清单</h1>
                <div id="newTask">
                    <input type="text" placeholder="输入待办事项" v-model="newTodo" v-on:keyup.enter="addTodo">
                    <button v-on:click="addTodo">添加</button>
                </div>
            </header>       
            <ol id="todos">
                <li v-for="todo in todoList">
                    <input type="checkbox" v-model="todo.done" v-on:change="handleTodos">
                    <span class="todo-title">{{todo.title}}</span>
                    <span class="done-or-not" v-if="todo.done">（已完成）</span>
                    <span class="done-or-not" v-else></span>
                    <span class="created-time">创建于{{todo.createTime.month}}月{{todo.createTime.day}}日{{todo.createTime.hour}}时{{todo.createTime.minute}}分</span>
                    <div v-on:click="delTodo(todo)" class="remove">移除</div>
                </li>
            </ol>
        </section>
    </div>
  </div>
</template>

<script>
import AV from './lib/leancloud';
import MyDialog from './components/MyDialog'
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
      actionType: 'none',
      isSignIn: false,
      user: {
        // username: '',
        // id: '',
        // objId: ''
      }
    }
  },
  components: { MyDialog, SignInForm, SignUpForm },
  created: function() {
    if (AV.User.current()){
      this.initUser(getAVUser());
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
    initUser: function({id,username}){
        this.isSignIn =true;
        this.user.id = id;
        this.user.username = username;
        this.actionType = 'none';
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
}

#app {
    margin: 50px auto;

}

.layout {
    width: 900px;
    margin: 0 auto;
}
#nav {
    position: fixed;
    height: 40px;
    background-color: #000;
    opacity: 0.7;
    top: 0;
    left: 0;
    right: 0;
    // z-index: 998;
    span {
      color: #fff;
    }
    .btn {
      line-height: 40px;
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
  }
}
#dialogWapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  // z-index: 999;
  background: hsla(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  #myDialog {
    width: 300px;
    height: 200px;
    background: #fff;
  }
}
#todo {
    #header {
        margin: 10px auto;
        border-bottom: 2px solid green;
    }
    #todos {
        li {
            height: 40px;
            margin-top: 20px;
            border-bottom: 1px solid;
            line-height: 40px;
            &:after {
                content: '';
                display: block;
                clear: both;
            }
            .todo-title {
                display: inline-block;
                width: 400px;
            }
            .created-time {
                font-size: 12px;
                color: #333;
            }
            .done-or-not {
                display: inline-block;
                width: 100px;
                color: #238;
            }
            .remove {
                float: right;
                width: 60px;
                height: 30px;
                border-radius: 10px;
                background-color: orange;
                color: #fff;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
}

</style>
