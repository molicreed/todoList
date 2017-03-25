/**
 * Created by coffe on 2017-3-23.
 */
const Vue = require('vue');
const AV = require('leancloud-storage');
const appId = 'be0B7Hrmn2ek9qx7d8yFK5eP-gzGzoHsz';
const appKey = 'm4dplgRGaxNu2khXIWPA6ewS';
AV.init({appId,appKey});
var myTodos,ac1;
class MyTodos extends AV.Object {};
let app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: [],
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        currentUser: null
    },
    created: function (){
        if (this.getCurrentUser()){
           this.readTodos();
        }
    },
    methods: {
        readTodos: function(){
            this.currentUser = this.getCurrentUser();
            console.log('User id',this.currentUser.id);
            var query = new AV.Query('MyTodos');
            query.find().then((todos)=>{
                let avAllTodos = todos[0];
                if (avAllTodos) {
                    this.todoList = JSON.parse(avAllTodos.attributes.content);
                    this.todoList.id = avAllTodos.id;
                } else {
                    console.log('未读取到信息')
                }
            },(err)=>{
                console.error('query.find错误');
            });
        },
        updateTodos: function(){
            console.log('Object id：',this.todoList.id);
            let dataString = JSON.stringify(this.todoList);
            let todo = AV.Object.createWithoutData('MyTodos',this.todoList.id);
            todo.set('content',dataString);
            todo.save().then(()=>{
                console.log('update Success');
                
            },(err)=>{
                console.error('update wrong');
            });
        },
        saveTodos: function(){
            let dataString = JSON.stringify(this.todoList);
            myTodos = new MyTodos();
            AV.Object.register(MyTodos);
            ac1 = new AV.ACL();
            ac1.setReadAccess(AV.User.current(),true);
            ac1.setWriteAccess(AV.User.current(),true);
            myTodos.set('content',dataString);
            myTodos.setACL(ac1);
            myTodos.save().then((todo)=>{
                console.log('当前id：',todo.id);
                this.todoList.id = todo.id;
                console.log('Object id：',this.todoList.id);
                console.log('Save Success');
            },(err)=>{
                console.error('Save Error');
            });
        },
        handleTodos: function (){
            if (this.todoList.id){
                this.updateTodos();
            } else {
                this.saveTodos();
            }
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
        signUp: function(){
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser)=> {
                this.signIn();
            },(err)=>{
                console.error('注册失败');
            });
        },
        signIn: function(){
            AV.User.logIn(this.formData.username,this.formData.password).then((loginedUser)=>{
                this.readTodos();
            },(err)=>{
                console.error('登录失败');
            });
        },
        getCurrentUser: function(){
            let current = AV.User.current();
            if (current){
                let {id,createdAt,attributes: {username}} = current;
                return {id,username,createdAt};
            } else {
                return null;
            }
            
        },
        logOut: function(){
            AV.User.logOut();
            this.currentUser = null;
            window.location.reload();
        }
    }
})
