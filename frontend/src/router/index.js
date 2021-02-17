import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/AddPlayersView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'AddPlayers',
    component: Home,
  },
  {
    path: '/m/:id',
    name: 'Match',
    component: () => import(/* webpackChunkName: "Match" */ '@/views/MatchView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
