<template>
  <v-app>
    <v-content>
      <MasterPage/>
    </v-content>
  </v-app>
</template>

<script>
import MasterPage from './components/MasterPage';

export default {
  name: 'App',
  components: {
    MasterPage
  },
  data: () => ({
    //
  }),
};
</script>
<style>
  @import "./assets/css/material-icons.css";
  .fondoBarra{
    background: black;
    color: white;
  }
</style>