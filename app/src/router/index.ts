import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(), // hash mode for single html file without server
    strict: true,
    routes: [
        {
            name: 'view-page',
            path: '/view/',
            component: () => import('../components/page/ViewPage.vue' /* webpackChunkName: "page/view" */),
        },
        {
            name: 'editor-page',
            path: '/editor/',
            component: () => import('../components/page/EditorPage.vue' /* webpackChunkName: "page/editor" */),
        },
        {
            name: 'otherwise',
            path: '/(.*)?',
            redirect: {name: 'view-page'},
        },
        {
            name: 'otherwise',
            path: '/',
            redirect: {name: 'view-page'},
        },
    ]
});

export default router