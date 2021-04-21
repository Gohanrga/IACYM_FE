<template>
    <v-layout align-center justify-center wrap row>
        
            <div class="alinear">
                <v-img width="400" class="tamanio" :src="require('@/assets/central.jpg')"></v-img>
            </div>
        
    </v-layout>
</template>

<script>

  export default {
    components: {
      
    },
  };
</script>
<style >
    .alinear{
        text-align: center;
    }
    .tamanio{
      width: 100%;
    }
    @media screen and (max-width: 800px) {
      .tamanio{
        width: 90%;
      }
    }
    
</style>