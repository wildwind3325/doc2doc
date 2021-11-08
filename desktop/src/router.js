import Vue from 'vue';
import Router from 'vue-router';
import Master from './pages/Master';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    component: Master,
    children: [{
      path: '',
      component: Home
    }]
  }, {
    path: '*',
    component: NotFound
  }]
});

export default router;