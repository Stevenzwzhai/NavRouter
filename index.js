const Router = require('vue-router')
const routerStoreKey = Symbol('router');
const triggerStoreKey = Symbol('trigger');
Router.prototype.nav = function(route, onComplete, onAbort) {
    if((onComplete && typeof onComplete!=='function') || (onAbort && typeof onAbort!=='function')){
        throw new Error('nav success or error callback must a function')
    }
    window.sessionStorage.setItem(triggerStoreKey, 1)
    let routerStack = window.sessionStorage.getItem(routerStoreKey);
    if (routerStack) {
        routerStack.push(route)
        window.sessionStorage.setItem(routerStoreKey, routerStack);
    }
    Router.prototype.replace(route, onComplete, onAbort);
}

Router.prototype.beforeEach((to, from, next) => {
    //清楚回退键的路由，1.路由始终保持只有一个，2.防止iOS的左滑影响购物车滑动删除
    if (window.sessionStorage.getItem(triggerStoreKey) != 1) {
        window.sessionStorage.setItem(triggerStoreKey, 1)
        let routerStack = window.sessionStorage.getItem(routerStoreKey);
        if (routerStack.length > 1) {
            next(false);
            routerStack.pop();
        }else{
            window.sessionStorage.setItem(triggerStoreKey, 0)
            next();
        }
        router.replace(routerStack[routerStack.length - 1]);
        window.sessionStorage.setItem(routerStoreKey, routerStack);
    } else {
        window.sessionStorage.setItem(triggerStoreKey, 0)
        next()
    }
})
moudule.exports = {Router}