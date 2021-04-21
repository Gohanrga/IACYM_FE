<template >
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Usuarios</span>
            <v-divider class="primary"></v-divider>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <v-btn class="mx-2" 
                   fab 
                   dark 
                   color="teal"
                   @click="abreModalRegistro()">
                <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md8 lg8>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Búsqueda por usuario, nombre, apellido"
                single-line
                hide-details
            ></v-text-field>
            <br>
            <v-data-table
                :headers="cabecera"
                :items="listaUsuarios"
                :items-per-page="10"
                class="elevation-1"
                :search="search"
                :loading="cargando" loading-text="Cargando... Porfavor espere"
            >
                <template v-slot:item="prop">
                    <tr>
                        <td
                            class="text-xs-center"
                            v-show="false"
                        >{{prop.item.idUsuario}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.usuario}}</td>
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
                        >{{ (prop.item.estado===1)?'Activo':'Inactivo' }}</td>
                        <td class="text-xs-center"
                            v-show="true">
                            <v-icon
                                color="light-green"
                                small
                                class="mr-2"
                                @click="obtieneUsuarioParaEdicion(prop.item.idUsuario)"
                            >
                            edit
                            </v-icon>
                            <v-icon
                                color="red accent-4"
                                small
                                @click="abreModalEliminar(prop.item.idUsuario)"
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
                    Agregar un usuario
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                          label="Usuario" 
                                          :rules="[rules.required]"
                                          v-model="usuario"
                                          >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field
                                outlined
                                :append-icon="mostrarContraseña ? 'visibility' : 'visibility_off'"
                                :rules="[rules.required, rules.min]"
                                :type="mostrarContraseña ? 'text' : 'password'"
                                name="input-10-1"
                                label="Password"
                                hint="At least 8 characters"
                                counter
                                @click:append="mostrarContraseña = !mostrarContraseña"
                                v-model="password"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                          label="Nombre" 
                                          :rules="[rules.required]"
                                          v-model="nombre"
                                          >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-text-field outlined 
                                          label="Apellido"
                                          v-model="apellido"
                                          >
                            </v-text-field>
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
                        @click="edita?modificaUsuario() : registraUsuario()"
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
                    <v-btn color="primary tertiary--text" round @click="eliminaUsuario()">Aceptar</v-btn>
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
    components: {
      
    },
    data:()=>({
        cabecera:[
            {
                text:'USUARIO', 
                class: "primary white--text font-weight-bold",
                value:'usuario'
            },
            {
                text:'NOMBRE', 
                class: "primary white--text font-weight-bold",
                value:'nombre'},
            {
                text:'APELLIDO', 
                class: "primary white--text font-weight-bold",
                value:'apellido'
            },
            {
                text:'ESTADO', 
                class: "primary white--text font-weight-bold",
                value:'estado'
            },
            {
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
            ],
        listaUsuarios:[],
        cargando:false,
        dialogForm:false,
        dialogEliminar:false,
        mostrarContraseña:false,
        idUsuario: 0,
        usuario:'',
        password:'',
        nombre:'',
        apellido:'',
        estado:0,
        snackbar: false,
        snackbarColor: "",
        snackbarTimeout: 6000,
        snackbarText: "",
        edita:false,
        search:'',
        itemsActivo: [{"id":1, "estado":"Activo"},
                     {"id":0, "estado":"Inactivo"},],
        rules: {
          required: value => !!value || 'Requerido.',
          min: v => v.length >= 8 || 'Al menos debe tener 8 caracteres'
        },
    }),
    methods:{
        validaCampos(){
            if(this.usuario ==='' || this.usuario===null || this.usuario===undefined){
                this.mensajeDesplegar(
                    "Debe introducir un usuario",
                    "error"
                ); 
                return false;
            }
            if(this.password ==='' || this.password===null || this.password===undefined){
                this.mensajeDesplegar(
                    "Debe introducir una contraseña",
                    "error"
                ); 
                return false;
            }
            if(this.nombre ==='' || this.nombre===null || this.nombre===undefined){
                this.mensajeDesplegar(
                    "Debe introducir un nombre",
                    "error"
                ); 
                return false;
            }
            return true;
        },
        abreModalEliminar(id){
            this.dialogEliminar = true;
            this.idUsuario = id;
        },
        abreModalRegistro(){
            this.idUsuario = 0;
            this.usuario = '';
            this.password = '';
            this.nombre = '';
            this.apellido = '';
            this.estado = 0;
            this.edita = false;
            this.dialogForm = true;
        },
        /**
         * Obtiene usuarios de la base de datos
         */
        obtieneUsuarios(){
            this.cargando = true;
            apiService
                .getUsuarios()
                .then(data=>{
                    this.cargando = false;
                    this.listaUsuarios = data.data;
                })
                .catch(error=>{
                    this.cargando = false;
                    this.handleErrors(error);
                })
        },
        /**
         * registro de usuario 
         */
        registraUsuario(){
            if(this.validaCampos()){
                let parametros = {
                    usuario: this.usuario,
                    password: this.password,
                    nombre: this.nombre,
                    apellido: this.apellido
                }
                apiService
                .postRegistroUsuario(parametros)
                .then(data=>{
                    this.listaUsuarios.push(data.data)
                    this.dialogForm = false;
                    this.mensajeDesplegar(
                        "Se registro al usuario con exito ",
                        "success"
                    ); 
                })
                .catch(error=>{
                    this.handleErrors(error);
                })
            }
        },
        /**
         * registro de usuario 
         */
        modificaUsuario(){
            if(this.validaCampos()){
                let parametros = {
                    idUsuario: this.idUsuario,
                    usuario: this.usuario,
                    password: this.password,
                    nombre: this.nombre,
                    apellido: this.apellido,
                    estado: this.estado
                }
                apiService
                .putModificaUsuario(parametros)
                .then(data=>{
                    this.listaUsuarios=[];
                    this.obtieneUsuarios();
                    this.dialogForm = false;
                    this.edita = false;
                    this.mensajeDesplegar(
                        "Se modifico al usuario con exito",
                        "success");
                })
                .catch(error=>{
                    this.dialogForm = false;
                    this.handleErrors(error);
                })
            }
        },

        eliminaUsuario(){
            apiService
            .deleteEliminaUsuario(this.idUsuario)
            .then(data=>{
                this.listaUsuarios=[];
                this.obtieneUsuarios();
                this.dialogEliminar = false;
                this.mensajeDesplegar(
                    "Se elimino al usuario con exito",
                    "success");
            })
            .catch(error=>{
                this.handleErrors(error);
            })
        },
        /**
         * buscamos al usuario que sera modificado
         */
        obtieneUsuarioParaEdicion(id){
            for(let i=0; i< this.listaUsuarios.length; i++){
                if(this.listaUsuarios[i].idUsuario === id)
                {
                    this.idUsuario = id;
                    this.usuario = this.listaUsuarios[i].usuario;
                    this.password = this.listaUsuarios[i].password;
                    this.nombre = this.listaUsuarios[i].nombre;
                    this.apellido = this.listaUsuarios[i].apellido;
                    this.estado = this.listaUsuarios[i].estado;
                    this.dialogForm = true;
                    this.edita = true;
                    continue;
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
        this.obtieneUsuarios();
    }
  };
</script>
<style >
    .alinear{
        text-align: center;
    }
</style>