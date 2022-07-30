import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
// import editor from '../views/editor.vue'
// import find from '../views/finds.vue'
// import blogs from '../views/blogs.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    // component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/editor',
    // component: editor
    component: () => import(/* webpackChunkName: "about" */ '../views/editor.vue')
  },
  {
    path: '/finds',
    // component: find
    component: () => import(/* webpackChunkName: "about" */'../views/finds.vue')
  },
  {
    path: '/blogs',
    // component: blogs
    component: () => import(/* webpackChunkName: "about" */ '../views/blogs.vue')
  },
  {
    path:'/myCenter',
    component:()=> import('../views/myCenter.vue')
  },
  {
    path:'/personal',
    component:()=>import('../views/personalData.vue')
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
import vuex from'../store/index'
// const getCookie = function (cname) {
//   var name = cname + "=";
//   var ca = document.cookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i].trim();
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// };
router.beforeEach((to) => {
  if(vuex.state.lives==false){
    if (to.path == '/personal' ||to.path=='/editor') {
      return '/'
    }else{
      return true
    }
  }
  
})
export default router
