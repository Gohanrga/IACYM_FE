import Vue from 'vue'
import Router from 'vue-router'
import Store from './store.js';
import Home from './views/Home.vue'
import Login from './components/login.vue';
import Menu from './views/Menu';
import Inicio from './components/componentes_privados/Inicio.vue';
import Usuarios from './components/componentes_privados/Usuario.vue';
import Miembros from './components/componentes_privados/Miembros.vue';
import TiposConcepto from './components/componentes_privados/TipoConcepto.vue';
import CuentaContable from './components/componentes_privados/CuentaContable.vue';
import Ingresos from './components/componentes_privados/Ingresos.vue';
import Egresos from './components/componentes_privados/Egresos.vue';
import TipoCambio from './components/componentes_privados/TipoCambio.vue';
import Reporte from './components/componentes_privados/reporte.vue';
Vue.use(Router);
const store = Store;
const router = new Router({
  routes: [
    {
      path: '/', name: 'Inicio', component: Home
    },
    {
      path: '/Login' , name: 'Login', component: Login
    },
    {
      path: '/inicioLogin', name: 'InicioLogin', component: Inicio
    },
    {
      path: '/usuarios', name: 'ListaUSuarios', component: Usuarios
    },
    {
      path: '/miembros', name: 'Miembros', component: Miembros
    },
    {
      path: '/tipo_concepto', name: 'TipoConcepto', component: TiposConcepto
    },
    {
      path: '/cuenta_contable', name: 'CuentaContable', component: CuentaContable
    },
    {
      path: '/ingresos', name: 'Ingresos', component: Ingresos
    },
    {
      path: '/egresos', name: 'Egresos', component: Egresos
    },
    {
      path: '/tipoCambio', name: 'TipoCambio', component: TipoCambio
    },
    {
      path: '/reporte', name: 'Reportes', component: Reporte
    },
    {
      path: '/menu' , name: 'Menu', component: Menu
    },
    {
      path: '*', redirect: '/'
    },
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/Login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.state.session;
  if (authRequired && (loggedIn==='' || loggedIn === undefined || loggedIn === null)) {
    return next('/Login');
  }

  next();
})

export default router;