<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Tipos de Concepto</span>
            <v-divider class="primary"></v-divider>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <v-btn class="mx-2" 
                   fab 
                   dark 
                   color="teal"
                   @click="abreModal()"
                   >
                <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md8 lg6>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Búsqueda por descripción"
                single-line
                hide-details
            ></v-text-field>
            <br>
            <v-data-table
                :headers="cabecera"
                :items="listaConceptos"
                :items-per-page="10"
                class="elevation-1"
                :loading="cargando" loading-text="Cargando... Porfavor espere"
            >
                <template v-slot:item="prop">
                    <tr>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.idTipoConcepto}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.descripcion}}</td>
                        <td class="text-xs-center"
                            v-show="true">
                            <v-icon
                                color="light-green"
                                small
                                class="mr-2"
                                @click="abreModalEdicion(prop.item.idTipoConcepto)"
                            >
                            edit
                            </v-icon>
                            <v-icon
                                color="red accent-4"
                                small
                                @click="abreModaEliminar(prop.item.idTipoConcepto)"
                                >
                                delete
                            </v-icon>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
        <v-dialog v-model="dialogForm" persistent width="600px">
            <v-card>
                <v-card-title
                    class="primary white--text"
                    primary-title
                    >
                    Agregar un Tipo Conceptos
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-textarea 
                                outlined 
                                label="Descripciòn" 
                                :rules="[rules.required]"
                                v-model="descripcion"
                            >
                            </v-textarea>
                        </v-flex>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                        color="primary"
                        outlined
                        @click="edita?modificaTipoConcepto():registraTipoConcepto()"
                    >
                        Guardar
                    </v-btn>
                    <v-btn
                        color="primary"
                        outlined
                        @click="dialogForm = false"
                    >
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> 
        <v-dialog v-model="dialogEliminar" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">¿Esta seguro de eliminar el elemento?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary tertiary--text" round @click="dialogEliminar = false">Cancelar</v-btn>
                    <v-btn color="primary tertiary--text" round @click="eliminaTipoConcepto()">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
    </v-layout>
</template>
<script>
import {APIService} from '../../APIService';
  const apiService = new APIService();
export default {
    
    data:()=>({
        cargando:false,
        cabecera:[
            {
                text:'ID', 
                class: "primary white--text font-weight-bold",
                value:'idTipoConcepto'
            },
            {
                text:'DESCRIPCION', 
                class: "primary white--text font-weight-bold",
                value:'descripcion'
            },
            {
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
        ],
        listaConceptos:[],
        dialogForm: false,
        rules: {
          required: value => !!value || 'Requerido.'
        },
        descripcion:'',
        snackbar: false,
        snackbarColor: "",
        snackbarTimeout: 6000,
        snackbarText: "",
        edita:false, 
        idConcepto:0,
        dialogEliminar:false,
        search:'',
    }),
    methods:{
        abreModal(){
            this.descripcion = '';
            this.dialogForm = true;
            this.edita = false;
        },
        /**
         * Obtiene usuarios de la base de datos
         */
        obtieneConceptos(){
            this.cargando = true;
            apiService
                .getTiposConceptos()
                .then(data=>{
                    this.cargando = false;
                    this.listaConceptos = data.data;          
                })
                .catch(error=>{
                    this.cargando = false;
                })
        },
        registraTipoConcepto(){
            if(this.descripcion==='' || this.descripcion===null || this.descripcion ===undefined){
                this.mensajeDesplegar(
                    "Debe introducir una descripción",
                    "error");
                return;
            }
            let parametros = {
                descripcion: this.descripcion
            };
            apiService
                .postTipoConcepto(parametros)
                .then(data=>{
                    this.listaConceptos.push(data.data);
                    this.dialogForm = false;
                    this.mensajeDesplegar(
                    "Se registro el concepto con exito ",
                    "success"
                ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
        },
        modificaTipoConcepto(){
            let parametros = {
                idTipoConcepto: this.idConcepto,
                descripcion: this.descripcion
            };
            apiService
                .putModificaTipoConcepto(parametros)
                .then(data=>{
                    this.listaConceptos= [];
                    this.obtieneConceptos();
                    this.dialogForm = false;
                    this.edita = false;
                    this.mensajeDesplegar(
                    "Se modifico el concepto con exito ",
                    "success"
                ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
        },
        eliminaTipoConcepto(){
            apiService
                .deleteTipoConcepto(this.idConcepto)
                .then(data=>{
                    this.listaConceptos= [];
                    this.obtieneConceptos();
                    this.dialogEliminar = false;
                    this.mensajeDesplegar(
                    "Se elimino el concepto con exito ",
                    "success"
                ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
        },
        abreModalEdicion(id){
            
            for(let i=0; i< this.listaConceptos.length; i++){
                if(this.listaConceptos[i].idTipoConcepto === id){
                    this.idConcepto = this.listaConceptos[i].idTipoConcepto;
                    this.descripcion = this.listaConceptos[i].descripcion;
                    this.dialogForm = true;
                    this.edita = true;
                    continue;
                }
            }
        },
        abreModaEliminar(id){
            this.idConcepto = id;
            this.dialogEliminar = true;
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
    },
    mounted(){
        if(this.$store.state.session==='')
            this.$router.push("Login");
        this.obtieneConceptos();
    }
}
</script>