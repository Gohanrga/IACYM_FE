<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Cuenta Contable</span>
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
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <br>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Búsqueda por Código, descripción"
                single-line
                hide-details
            ></v-text-field>
            <br>
            <v-data-table
                :headers="cabecera"
                :items="listaCuentasContables"
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
                        >{{prop.item.codigo}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.tipoCuenta==='I'?'Ingreso':'Egreso'}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.descripcion}}</td>
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
                                @click="abreModalEdicion(prop.item.codigo)"
                            >
                            edit
                            </v-icon>
                            <v-icon
                                color="red accent-4"
                                small
                                @click="abreModaEliminar(prop.item.codigo)"
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
                    Agregar una Cuenta Contable
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                label="Código" 
                                :rules="[rules.required]"
                                v-model="codigo"
                                          >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-textarea 
                                outlined 
                                label="Descripciòn" 
                                :rules="[rules.required]"
                                v-model="descripcion"
                            >
                            </v-textarea>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-select
                            :items="itemsTipo"
                            item-text="tipo"
                            item-value="id"
                            label="Tipo"
                            v-model="tipo"
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
                        @click="edita?modificaCuentaContable():registraCuentaContable()"
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
                    <v-btn color="primary tertiary--text" rounded @click="dialogEliminar = false">Cancelar</v-btn>
                    <v-btn color="primary tertiary--text" rounded @click="eliminaCuentaContable()">Aceptar</v-btn>
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
                text:'CODIGO', 
                class: "primary white--text font-weight-bold",
                value:'codigo'
            },
            {
                text:'TIPO', 
                class: "primary white--text font-weight-bold",
                value:'tipoCuenta'
            },
            {
                text:'DESCRIPCION', 
                class: "primary white--text font-weight-bold",
                value:"descripcion"
            },
            {
                text:'USUARIO CREACION', 
                class: "primary white--text font-weight-bold",
                value:"usuarioCreacion"
            },
            {
                text:'FECHA CREACION', 
                class: "primary white--text font-weight-bold",
                value:"fechaCreacion"
            },
            {
                text:'USUARIO MODIFICACION', 
                class: "primary white--text font-weight-bold",
                value:"usuarioModificacion"
            },
            {
                text:'FECHA MODIFICACION', 
                class: "primary white--text font-weight-bold",
                value:"fechaModificacion"
            },
            {
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
        ],
        listaCuentasContables:[],
        dialogForm: false,
        rules: {
          required: value => !!value || 'Requerido.'
        },
        codigo:'',
        descripcion:'',
        tipo:'',
        snackbar: false,
        snackbarColor: "",
        snackbarTimeout: 6000,
        snackbarText: "",
        edita:false, 
        dialogEliminar:false,
        itemsTipo: [{"id":'I', "tipo":"Ingreso"},
                     {"id":'E', "tipo":"Egreso"},],
        search:''
    }),
    methods:{
        validaCampos(){
            if(this.codigo==='' || this.codigo===null || this.codigo === undefined){
                this.mensajeDesplegar(
                    "Debe introducir un código ",
                    "error"
                    );
                return false;
            }
            if(this.descripcion==='' || this.descripcion===null || this.descripcion === undefined){
                this.mensajeDesplegar(
                    "Debe introducir una descripción ",
                    "error"
                    );
                return false;
            }
            if(this.tipo===0 || this.tipo===null || this.tipo === undefined){
                this.mensajeDesplegar(
                    "Debe introducir un tipo de cuenta",
                    "error"
                    );
                return false;
            }
            return true;
        },
        formatDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },
        abreModal(){
            this.descripcion = '';
            this.codigo = '';
            this.tipo = '';
            this.dialogForm = true;
            this.edita = false;
        },
        /**
         * Obtiene usuarios de la base de datos
         */
        obtieneCuentasContables(){
            this.cargando = true;
            apiService
                .getCuentasContables()
                .then(data=>{
                    this.cargando = false;
                    this.listaCuentasContables = data.data;          
                })
                .catch(error=>{
                    this.handleErrors(error);
                    this.cargando = false;
                })
        },
        registraCuentaContable(){
            if(this.validaCampos()){
                let parametros = {
                    codigo:  this.codigo,
                    tipoCuenta: this.tipo,
                    descripcion: this.descripcion,
                    usuarioCreacion: this.$store.state.session.usuario 
                };
                apiService
                    .postRegistroCuenta(parametros)
                    .then(data=>{
                        this.listaCuentasContables.push(data.data);
                        this.dialogForm = false;
                        this.mensajeDesplegar(
                        "Se registro la Cuenta Contable con exito ",
                        "success"
                        ); 
                    })
                    .catch(error=>{
                        this.handleErrors(error);
                    })
            }
        },
        modificaCuentaContable(){
            if(this.validaCampos()){
                let parametros = {
                    codigo:  this.codigo,
                    tipoCuenta: this.tipo,
                    descripcion: this.descripcion,
                    usuarioModificacion: this.$store.state.session.usuario 
                };
                apiService
                    .putModificaCuentaContable(parametros)
                    .then(data=>{
                        this.listaCuentasContables= [];
                        this.obtieneCuentasContables();
                        this.dialogForm = false;
                        this.edita = false;
                        this.mensajeDesplegar(
                        "Se modifico la cuenta contable con exito ",
                        "success"
                    ); 
                    })
                    .catch(error=>{
                        this.handleErrors(error);
                    })
            }
        },
        eliminaCuentaContable(){
            apiService
                .deleteCuentaContable(this.codigo)
                .then(data=>{
                    this.listaCuentasContables= [];
                    this.obtieneCuentasContables();
                    this.dialogEliminar = false;
                    this.mensajeDesplegar(
                    "Se elimino la cuenta contable con exito ",
                    "success"
                ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
        },
        abreModalEdicion(codigo){
            
            for(let i=0; i< this.listaCuentasContables.length; i++){
                if(this.listaCuentasContables[i].codigo === codigo){
                    this.codigo = this.listaCuentasContables[i].codigo;
                    this.descripcion = this.listaCuentasContables[i].descripcion;
                    this.tipo = this.listaCuentasContables[i].tipoCuenta;
                    this.dialogForm = true;
                    this.edita = true;
                    continue;
                }
            }
        },
        abreModaEliminar(codigo){
            this.codigo = codigo;
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
        this.obtieneCuentasContables();
    }
}
</script>