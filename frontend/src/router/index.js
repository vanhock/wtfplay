import Vue from 'vue';
import VueRouter from 'vue-router';
import GamesView from '@/views/GamesView';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'AddPlayers',
    component: GamesView,
  },
  {
    path: '/m/:id',
    name: 'Match',
    component: GamesView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
