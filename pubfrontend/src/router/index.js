import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import CadastroView from '../views/CadastroView.vue';
import LayoutBase from '../components/LayoutBase.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastro', name: 'Cadastro', component: CadastroView },

  {
    path: '/',
    component: LayoutBase,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'bebidas',
        name: 'Bebidas',
        component: () => import('../views/BebidasView.vue')
      },
      {
        path: 'bebidas/nova',
        name: 'NovaBebida',
        component: () => import('../views/FormularioBebidaView.vue')
      },
      {
        path: 'bebidas/editar/:id',
        name: 'EditarBebida',
        component: () => import('../views/FormularioBebidaView.vue')
      }
    ]
  },

  { path: '/', redirect: '/bebidas' }, // 🔥 IMPORTANTE
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.name === 'Login' && token) {
    next('/bebidas');
  } else {
    next();
  }
});

export default router;