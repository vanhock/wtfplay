import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/AddPlayers.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/m/:id',
    name: 'About',
    component: () => import(/* webpackChunkName: "Match" */ '@/views/Match.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
