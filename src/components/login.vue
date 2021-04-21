<template >
    <v-layout align-center justify-center wrap row >
        <v-flex xs10 sm9 md6 lg4>
            <br>
            <v-card
            elevation="1"
            >
                <v-layout align-center justify-center width="30">
                    <v-col cols="12" sm="6">
                        <v-row align="center">
                            <v-img :src="require('@/assets/logo_iacym.jpeg')" ></v-img>
                        </v-row>
                    </v-col>
                </v-layout>
                <v-card-title >
                    <span class="headline font-weight-bold primary--text"> 
                        Iniciar Sesión
                    </span>
                    </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            prepend-inner-icon="person"
                            label="Usuario"
                            v-model="usuario"
                            rounded
                            filled
                        ></v-text-field>
                        <v-text-field
                            :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
                            @click:append="passwordVisible = !passwordVisible"
                            :type="passwordVisible ? 'text' : 'password'"
                            prepend-inner-icon="lock"
                            name="input-10-2"
                            label="Password"
                            hint="Minimamente 8 caracteres"
                            class="input-group--focused"
                            v-model="password"
                            rounded
                            filled
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions >
                    <v-layout align-center justify-end>
                        <div class="text-right">
                            <v-btn @click="login()" 
                            rounded
                            color="primary">Ingresar</v-btn>
                        </div>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            multi-line
            :timeout="snackbarTimeout"
            vertical
            top
            >
            {{ snackbarText }}
        <v-btn text @click="snackbar = false">Cerrar</v-btn>
        </v-snackbar>
        <v-flex xs11 sm11 md8 lg11>
            <div v-if="loading" style="text-align:center;">
                <v-dialog v-model="loading" hide-overlay fullscreen content-class="loading-dialog">
                    <v-container fill-height>
                        <v-layout row justify-center align-center>
                            <v-progress-circular :size="80" :width="7" color="primary" indeterminate></v-progress-circular>
                        </v-layout>
                    </v-container>
                </v-dialog>
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
import {APIService} from '../APIService.js';
const apiService = new APIService();
export default {
  name: 'App',
  components: {
      
  },
  data: () => ({
    passwordVisible:false,
    usuario:'',
    password:'',
    snackbar: false,
    snackbarColor: "",
    snackbarTimeout: 6000,
    snackbarText: "",
    loading:false
  }),
  mounted(){
    if(this.$store.state.session!=='')
        this.$router.push("InicioLogin");
    let self = this;
    window.addEventListener("keyup", function() {
      if (event.keyCode === 13) {
        self.login();
      }
    });
  },
  methods: {
      /**
       * Inicio de Sesion
       */
    login(){
        this.loading = true;
        let parametrosJson = {
            usuario: this.usuario,
            password: this.password
        };
        apiService
        .postLogin(parametrosJson)
        .then(data=>{
            this.loading = false;
            let resultado = data.data;
            if(resultado !== 'error'){
                this.mensajeDesplegar(
                "Hola " +
                    resultado +
                    ", te damos la bienvenida.",
                "success"
                );
                this.$store.commit("login", resultado);
                this.$router.replace('/inicioLogin');
            }else{
                this.mensajeDesplegar(
                    "Usuario o contraseña incorrectos",
                    "error"
                );
            }
        })
        .catch(error=>{
            this.loading = false;
            this.handleErrors(error);
        })
    },
    /**
     * Metodo que permite desplegar un mensaje de:
     * error
     * Informacion
     * Exito
     * Como parametros de ingreso se debe enviar:
     * mensaje a desplegar
     * tipo de mensaje
     */
    mensajeDesplegar(mensaje, tipo) {
      this.snackbarColor = tipo;
      this.snackbarText = mensaje;
      this.snackbar = true;
    },
    /**
     * Manejo de errores 
     */
    handleErrors(err){
        if(err.response){
            this.mensajeDesplegar(
                err.response.data.message,
                "error"
            );
        }else
            this.mensajeDesplegar(
                "Ocurrio un problema con la peticion, porfavor intentelo mas tarde. ",
                "error"
            );  
    },
  }
};
</script>
<style>
    .fondo{
        background: #b2b2b2;
        width: 100%;
        height: 100%;
    }
    .loading-dialog {
        background-color: transparent;
    }
</style>