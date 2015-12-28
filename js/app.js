requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery  : "lib/jquery-1.11.3.min",
        underscore : "lib/underscore-min",
        backbone : 'lib/backbone-min',
        router  : "router",
        text    : "lib/text",
        utils   : "utils/util" 
        
    },
    shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
       'underscore': {
           exports: '_'
       },
       'jquery': {
           exports: '$'
       },
       'backbone': {
           deps: ['underscore'],
           exports: 'Backbone'
       }
    }
    //urlArgs: "bust=" +  (new Date()).getTime() //开发环境使用，防止缓存
});

require(['backbone', 'underscore', 'router',"utils"], function(){
    Backbone.history.start();   //开始监控url变化
});