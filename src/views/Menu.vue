<template>
  <v-list >
    <v-list-item-group v-model="model" mandatory color="cyan lighten-4">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        style="border:1px"
        @click="$router.push(item.ruta)"
      >
        <v-list-item-icon>
          <v-icon color="primary" v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content style="color:white">
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>
<script>
export default {
  data:()=>({
    items: [
      { icon: 'person', text: 'Usuarios' , ruta: '/usuarios'},
      { icon: 'contacts', text: 'Miembros', ruta: '/miembros' },
      { icon: 'queue_play_next', text: 'Ingresos', ruta: '/ingresos' },
      { icon: 'remove_from_queue', text: 'Egresos', ruta: '/egresos' },
      { icon: 'menu_book', text: 'Cuentas Contables', ruta: '/cuenta_contable' },
      { icon: 'dvr', text: 'Tipos de Concepto', ruta: '/tipo_concepto' },
      { icon: 'attach_money', text: 'Tipos de Cambio', ruta: '/tipoCambio' },
      { icon: 'print', text: 'Reportes', ruta: '/reporte' },
    ],
    model: 1,
  })
}
</script>