window.onload = function () {

    fundamentalvue.default(Vue)

    const asyncComponent = function (name) {
        return Vue.component(name, function (resolve, reject) {
            requirejs([`components/${name}`], resolve, reject)
        })
    }

    const app = new Vue({
        el: '#app',
        router: new VueRouter({
            routes: [
                { path: '/', component: asyncComponent('overview') },
                { path: '/details/:id', component: asyncComponent('details') },
                { path: '/create', component: asyncComponent('create') }
            ]
        })
    })
}
