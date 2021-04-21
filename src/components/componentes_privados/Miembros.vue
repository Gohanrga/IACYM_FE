<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Miembros</span>
            <v-divider class="primary"></v-divider>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <v-btn class="mx-2" 
                   fab 
                   dark 
                   color="teal"
                   @click="abrirModal()"
                   >
                <v-icon dark>mdi-plus</v-icon>
            </v-btn>
        </v-flex>
        <v-flex xs11 sm11 md8 lg8>
            <br>
            <v-switch v-model="switch1" inset color="primary" :label="labelSwitch" @change="muestraTodos()"/>
            <br>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Búsqueda por nombre, apellido, tarjeta"
                single-line
                hide-details
            ></v-text-field>
            <br>
            <v-data-table
                :headers="cabecera"
                :items="listaDatos"
                :items-per-page="10"
                :search="search"
                class="elevation-1"
                :loading="cargando" loading-text="Cargando... Porfavor espere"
            >
                <template v-slot:item="prop">
                    <tr>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.nombre}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.apellido}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.tarjetaDiezmo.numeroTarjeta}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.estado===1?'ACTIVO':'INACTIVO'}}</td>

                        <td class="text-xs-center"
                            v-show="true">
                            <v-icon
                                color="light-green"
                                small
                                class="mr-2"
                                @click="modificarModal(prop.item.idMiembro)"
                            >
                            edit
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
                    Agregar un Miembro
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                label="Nombre" 
                                :rules="[rules.required]"
                                v-model="nombre"
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field 
                                outlined 
                                label="Apellido" 
                                :rules="[rules.required]"
                                v-model="apellido"
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-select
                            :items="listaTarjetasDiezmo"
                            item-text="numeroTarjeta"
                            item-value="idDiezmo"
                            label="Número Tarjeta"
                            v-model="idDiezmo"
                            :rules="[rules.required]"
                            v-if="!edita || estadoAux===0"
                            solo
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-select
                            :items="itemsActivo"
                            item-text="estado"
                            item-value="id"
                            label="Estado"
                            v-if="edita"
                            v-model="estado"
                            solo
                            ></v-select>
                        </v-flex>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                        color="primary"
                        outlined
                        @click="edita?modificarMiembro():registraMiembro()"
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
                text:'NOMBRE', 
                class: "primary white--text font-weight-bold",
                value:'nombre'
            },
            {
                text:'APELLIDO', 
                class: "primary white--text font-weight-bold",
                value:'apellido'
            },
            {
                text:'NUMERO TARJETA', 
                class: "primary white--text font-weight-bold",
                value:"numeroTarjeta"
            },
            {
                text:'ESTADO', 
                class: "primary white--text font-weight-bold",
                value:"estado"
            },
            {
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
        ],
        rules: {
          required: value => !!value || 'Requerido.'
        },
        listaMiembros:[],
        listaMiembrosFiltrado:[],
        listaDatos:[],
        listaTarjetasDiezmo:[],
        itemsActivo: [{"id":1, "estado":"Activo"},
                     {"id":0, "estado":"Inactivo"},],
        edita:false,
        idMiembro:0,
        nombre:'',
        apellido:'',
        idDiezmo:0,
        estado:0,
        estadoAux:0,
        dialogForm:false,
        search:'',
        switch1:false,
        labelSwitch:'Activos'
    }),
    methods:{
        validaCampos(){
            if(this.nombre==='' || this.nombre===null || this.nombre === undefined){
                this.mensajeDesplegar(
                    "Debe introducir un nombre ",
                    "error"
                    );
                return false;
            }
            if(this.apellido==='' || this.apellido===null || this.apellido === undefined){
                this.mensajeDesplegar(
                    "Debe introducir un apellido ",
                    "error"
                    );
                return false;
            }
            if(this.idDiezmo===0 || this.idDiezmo===null || this.idDiezmo === undefined){
                this.mensajeDesplegar(
                    "Debe seleccionar una tarjeta ",
                    "error"
                    );
                return false;
            }
            return true;
        },
        muestraTodos(){
            if(this.switch1){
                this.labelSwitch = 'TODOS';
                this.listaDatos = this.listaMiembros;
            }
            else{
                this.labelSwitch = 'Activos';
                this.listaDatos = this.listaMiembrosFiltrado;
            }
        },
        obtieneMiembros(){
            this.cargando = true;
            apiService
            .getMiembros()
            .then(data=>{
                this.cargando = false;
                this.listaMiembros = data.data;
                for(let i = 0; i < this.listaMiembros.length; i++){
                    if(this.listaMiembros[i].estado ===1)
                        this.listaMiembrosFiltrado.push(this.listaMiembros[i]);
                }
                this.listaDatos = this.listaMiembrosFiltrado;
                this.labelSwitch = 'Activos';
                this.switch1=false;
            })
            .catch(error=>{
                this.handleErrors(error);
                    this.cargando = false;
            })
        },
        obtieneTarjetasDiezmo(){
            apiService
            .getTarjetaDiezmo()
            .then(data=>{
                this.listaTarjetasDiezmo = data.data;
            })
            .catch(error=>{
                this.handleErrors(error);
            })
        },
        abrirModal(){
            this.dialogForm = true;
            this.nombre = '';
            this.apellido = '';
            this.estado = 0;
            this.idMiembro = 0;
            this.idDiezmo = 0;
            this.edita = false;
        },
        modificarModal(id){
            this.dialogForm = true;
            for(let i = 0; i < this.listaMiembros.length; i++)
            {
                if(this.listaMiembros[i].idMiembro === id){
                    this.nombre = this.listaMiembros[i].nombre;
                    this.apellido = this.listaMiembros[i].apellido;
                    this.estado = this.listaMiembros[i].estado;
                    this.estadoAux = this.listaMiembros[i].estado;;
                    this.idMiembro = this.listaMiembros[i].idMiembro;
                    this.idDiezmo = this.listaMiembros[i].tarjetaDiezmo.numeroTarjeta;
                    this.edita = true;
                    continue;
                }
            }
        },
        registraMiembro(){
            if(this.validaCampos()){
                let parametros = {
                    nombre: this.nombre,
                    apellido: this.apellido,
                    tarjetaDiezmo: {idDiezmo: this.idDiezmo},
                    usuarioCreacion: this.$store.state.session.usuario 
                }
                apiService
                .postRegistraMiembros(parametros)
                .then(data=>{
                    this.dialogForm = false;
                    this.listaMiembros=[];
                    this.listaMiembrosFiltrado=[];
                    this.listaDatos=[];
                    this.obtieneMiembros();
                    this.listaTarjetasDiezmo=[];
                    this.obtieneTarjetasDiezmo();
                    this.mensajeDesplegar(
                        "Se registro el miembro con exito ",
                        "success"
                        ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
            }
        },
        modificarMiembro(){
            if(this.validaCampos()){
                let parametros = {
                    idMiembro: this.idMiembro,
                    tarjetaDiezmo: {idDiezmo: this.idDiezmo},
                    nombre: this.nombre,
                    apellido: this.apellido,
                    estado: this.estado,
                    usuarioModificacion: this.$store.state.session.usuario 
                }

                apiService
                .putModificaMiembro(parametros)
                .then(data=>{
                    this.listaMiembros=[];
                    this.listaMiembrosFiltrado=[];
                    this.listaDatos=[];
                    this.obtieneMiembros();
                    this.listaTarjetasDiezmo=[];
                    this.obtieneTarjetasDiezmo();
                    this.dialogForm = false;
                    this.edita = false;
                    this.mensajeDesplegar(
                        "Se modifico el miembro con exito ",
                        "success"
                        ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
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
        this.obtieneMiembros();
        this.obtieneTarjetasDiezmo();
    }
}
</script>