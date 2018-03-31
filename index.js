const Router = require('vue-router')
const routerStoreKey = Symbol('router');
const triggerStoreKey = Symbol('trigger');
Router.prototype.nav = function(page, query, clear) {
    let route = { path: page };
    window.sessionStorage.setItem(triggerStoreKey, 1)
    if (query) {
        route.query = query;
    }
    let routerStack = window.sessionStorage.getItem(routerStoreKey);
    if (routerStack) {
        if (clear) {
            routerStack.pop();
        }
        routerStack.push(route)
        window.sessionStorage.setItem(routerStoreKey, routerStack);
    }
    Router.prototype.replace(route);
}

Router.prototype.beforeEach((to, from, next) => {
    //清楚回退键的路由，1.路由始终保持只有一个，2.防止iOS的左滑影响购物车滑动删除
    if (window.sessionStorage.getItem(triggerStoreKey) != 1) {
        next(false);
        window.sessionStorage.setItem(triggerStoreKey, 1)
        let routerStack = window.sessionStorage.getItem(routerStoreKey);
        if (routerStack.length > 1) {
            routerStack.pop();
        }
        router.replace(routerStack[routerStack.length - 1]);
        window.sessionStorage.setItem(routerStoreKey, routerStack);
    } else {
        window.sessionStorage.setItem(triggerStoreKey, 0)
        next()
    }
})
moudule.exports = {Router}