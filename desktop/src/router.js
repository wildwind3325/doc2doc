import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [{
    path: '/',
    component: Home
  }, {
    path: '*',
    component: NotFound
  }]
});

export default router;