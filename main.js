/**
 * Created by coffe on 2017-3-23.
 */
const Vue = require('vue');

let app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
    },
    created: function (){
        window.onbeforeunload = ()=>{
            let localData = {
                text: '',
                list: []
            };
            localData.text = this.newTodo;
            localData.list = this.todoList;
            let dataString = JSON.stringify(localData);
            window.localStorage.setItem('myTodos',dataString);
        };
        let oldDataString = window.localStorage.getItem('myTodos');
            let oldData = JSON.parse(oldDataString);
            console.log(oldData);
            this.newTodo = oldData.text || '';
            this.todoList = oldData.list || [];
    },
    methods: {
        addTodo: function (event){
            let nowTime = new Date();
            this.todoList.push({
                title: this.newTodo,
                createTime: {
                    year: nowTime.getFullYear(),
                    month: nowTime.getMonth()+1,
                    day: nowTime.getDate(),
                    hour: nowTime.getHours(),
                    minute: nowTime.getMinutes()+1
                },
                done: false
            });
            this.newTodo = '';
        },
        delTodo: function (todo){
            let index = this.todoList.indexOf(todo);
            this.todoList.splice(index,1);
        }
    }
})
