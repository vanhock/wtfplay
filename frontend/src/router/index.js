import Vue from 'vue';
import VueRouter from 'vue-router';
import MatchView from '@/views/MatchView';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'AddPlayers',
    component: MatchView,
  },
  {
    path: '/m/:id',
    name: 'Match',
    component: MatchView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
