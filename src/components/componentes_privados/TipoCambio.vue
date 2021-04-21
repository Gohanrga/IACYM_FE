<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Tipos de Cambio</span>
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
        <v-data-table
            :headers="cabecera"
            :items="listaTipoCambio"
            :items-per-page="10"
            class="elevation-1"
            :loading="cargando" loading-text="Cargando... Porfavor espere"
        >
            <template v-slot:item="prop">
                <tr>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{formatDate(prop.item.fecha)}}</td>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{prop.item.valor}}</td>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{prop.item.usuarioCreacion}}</td>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{formatDate(prop.item.fechaCreacion)}}</td>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{prop.item.usuarioModificacion}}</td>
                    <td
                        class="text-xs-center"
                        v-show="true"
                    >{{formatDate(prop.item.fechaModificacion)}}</td>
                    <td class="text-xs-center"
                        v-show="true">
                        <v-icon
                            color="light-green"
                            small
                            class="mr-2"
                            @click="modificaModal(prop.item.idTipoCambio)"
                        >
                        edit
                        </v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogForm" persistent width="600px">
            <v-card>
                <v-card-title
                    class="primary white--text"
                    primary-title
                    >
                    Agregar Tipo Cambio
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                label="valor" 
                                v-model="valor"
                            >
                            </v-text-field>
                            <v-menu
                                ref="menuDateRegistro"
                                v-model="menuDateRegistro"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    v-model="dateFormattedRegistro"
                                    label="Fecha Registro"
                                    hint="dd/MM/YYYY"
                                    persistent-hint
                                    prepend-icon="event"
                                    @blur="fechaRegistro = parseDate(dateFormattedRegistro)"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="fechaRegistro" no-title @input="menuDateRegistro = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                        color="primary"
                        outlined
                        @click="edita? modificaTipoCambio():registraTipoCambio()"
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
        snackbar: false,
        snackbarColor: "",
        snackbarTimeout: 6000,
        snackbarText: "",
        cabecera:[
            {
                text:'FECHA', 
                class: "primary white--text font-weight-bold",
                value:'fecha'
            },
            {
                text:'VALOR', 
                class: "primary white--text font-weight-bold",
                value:'valor'
            },
            {
                text:'USUARIO CREACION', 
                class: "primary white--text font-weight-bold",
                value:'usuarioCreacion'
            },
            {
                text:'FECHA CREACION', 
                class: "primary white--text font-weight-bold",
                value:'fechaCreacion'
            },
            {
                text:'USUARIO MODIFICACION', 
                class: "primary white--text font-weight-bold",
                value:'usuarioModificacion'
            },
            {
                text:'FECHA MODIFICACION', 
                class: "primary white--text font-weight-bold",
                value:'fechaModificacion'
            },
            {
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
        ],
        listaTipoCambio:[],
        fechaRegistro: new Date().toISOString().substr(0, 10),
        dateFormattedRegistro:null,
        dialogForm:false,
        valor:6.86,
        idTipoCambio:0,
        edita:false,
        menuDateRegistro: false
    }),
    watch:{
        fechaRegistro (val) {
            this.dateFormattedRegistro = this.formatDate(this.fechaRegistro)
        },
    },
    methods:{
        formatDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },
        formatDateDB(date) {
            if (!date) return null;
            const [day, month, year] = date.split("/");
            return `${year}-${month}-${day}`;
        },
        formatDateDBMod(date) {
            if (!date) return null;
            const [day, month, year] = date.split("/");
            return new Date(year,parseInt(month)-1,parseInt(day)+1).toISOString().substr(0, 10)
            //return `${year}-${month}-${day+1}`;
        },
        obtieneTipoCambio(){
            this.cargando = true;
            apiService
            .getTipoCambios()
            .then(data=>{
                this.cargando = false;
                this.listaTipoCambio = data.data;
            })
            .catch(error=>{
                this.cargando = false;
                this.handleErrors(error);
            })
        },
        registraTipoCambio(){
            let parametros={
                valor: this.valor,
                fecha: this.formatDateDBMod(this.dateFormattedRegistro),
                usuarioCreacion: this.$store.state.session.usuario 
            }
            apiService
            .postRegistraTipoCambio(parametros)
            .then(data=>{
                this.dialogForm = false;
                this.listaTipoCambio=[];
                this.obtieneTipoCambio();
                this.mensajeDesplegar(
                    "Se registro el tipo de cambio con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        modificaTipoCambio(){
            let parametros={
                idTipoCambio: this.idTipoCambio,
                valor: this.valor,
                fecha: this.formatDateDBMod(this.dateFormattedRegistro),
                usuarioModificacion: this.$store.state.session.usuario 
            }

            apiService
            .putModificaTipoCambio(parametros)
            .then(data=>{
                this.dialogForm = false;
                this.listaTipoCambio=[];
                this.obtieneTipoCambio();
                this.mensajeDesplegar(
                    "La modificacion del tipo de cambio se realizo con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        abreModal(){
            this.dialogForm = true;
            this.dateFormattedRegistro = this.formatDate(new Date().toISOString().substr(0, 10));
            this.valor = 6.86;
            this.edita = false;
        },
        modificaModal(id){
            for(let i = 0; i < this.listaTipoCambio.length; i++){
                if(this.listaTipoCambio[i].idTipoCambio === id){
                    this.valor = this.listaTipoCambio[i].valor;
                    this.dateFormattedRegistro = this.formatDate(this.listaTipoCambio[i].fecha);
                    this.idTipoCambio = this.listaTipoCambio[i].idTipoCambio;
                    this.dialogForm = true;
                    this.edita = true;
                    break;
                }
            }
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
        this.obtieneTipoCambio();
    }
}
</script>