<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Ingresos</span>
            <v-divider class="primary"></v-divider>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <v-layout wrap align-center justify-center>
                <v-flex xs11 sm11 md5 lg5>
                    <v-menu
                        ref="menuDateInicio"
                        v-model="menuDateInicio"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                        >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            v-model="dateFormattedInicio"
                            label="Fecha inicio"
                            hint="dd/MM/YYYY"
                            persistent-hint
                            prepend-icon="event"
                            @blur="fechaInicio = parseDate(dateFormattedInicio)"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="fechaInicio" no-title @input="menuDateInicio = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs11 sm11 md5 lg5>
                    <v-menu
                        ref="menuDateFin"
                        v-model="menuDateFin"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                        >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            v-model="dateFormattedFin"
                            label="Fecha fin"
                            hint="dd/MM/YYYY"
                            persistent-hint
                            prepend-icon="event"
                            @blur="fechaFin = parseDate(dateFormattedFin)"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="fechaFin" no-title @input="menuDateFin = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs11 sm11 md2 lg2 >
                    <v-btn class="mx-2" fab dark medium color="primary" @click="listaIngresosEgresos()">
                        <v-icon color="white" dark>send</v-icon>
                    </v-btn>
                </v-flex>   
            </v-layout>
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
            <v-data-table
                :headers="cabecera"
                :items="listaIngresos"
                :items-per-page="10"
                item-key="idIngresoEgreso"
                class="elevation-1"      
                :loading="cargando" loading-text="Cargando... Porfavor espere"
            >
                <template v-slot:item="prop">
                    <tr>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >
                            <v-icon
                                color="light-green"
                                small
                                class="mr-2"
                                v-if="prop.item.estado===1"
                                @click="abreModalEdit(prop.item.idIngresoEgreso)"
                            >
                                edit
                            </v-icon>
                            <v-icon
                                color="red"
                                small
                                class="mr-2"
                                v-if="prop.item.estado===1"
                                @click="cambioEstado(prop.item.idIngresoEgreso)"
                            >
                                thumb_down
                            </v-icon>
                        </td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.idIngresoEgreso}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{ prop.item.culto!==null? prop.item.culto.descripcion:''}}</td>   
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.cuentaContable.codigo}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.concepto}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{formatDate(prop.item.fechaRegistro)}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.hoja}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.montoBs}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.montoUsd}}</td>
                        <td
                            class="text-xs-center"
                            v-show="true"
                        >{{prop.item.estado===1?'ACTIVO':'INACTIVO'}}</td>
                        <td >
                            <v-icon
                                v-show="!prop.item.extendido"
                                color="black"
                                class="mr-2"
                                @click="prop.item.extendido=true"
                            >
                            keyboard_arrow_down
                            </v-icon>
                            <v-icon
                                v-show="prop.item.extendido"
                                color="black"
                                class="mr-2"
                                @click="prop.item.extendido=false"
                            >
                            keyboard_arrow_up
                            </v-icon>
                        </td>
                    </tr>
                    <tr v-if="prop.item.extendido" style="background: #CFD8DC">
                        <td colspan="11">Descripción: {{prop.item.descripcion}}</td>
                    </tr>
                    <tr v-if="prop.item.extendido" style="background: #CFD8DC">
                        <td colspan="11">Usuario Registro: {{prop.item.usuarioCreacion}}, Fecha Registro: {{formatDate(prop.item.fechaCreacion)}},
                                        Usuario Modificaciòn: {{prop.item.usuarioModificacion}}, Fecha Modificación: {{formatDate(prop.item.fechaModificacion)}}
                        </td>
                    </tr>
                </template>
                <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
                    <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
                    <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
                </template>
            </v-data-table>
        </v-flex>
        <v-dialog v-model="dialogForm" persistent width="600px">
            <v-card>
                <v-card-title
                    class="primary white--text"
                    primary-title
                    >
                    Agregar transacción
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-flex xs12 sm12 md12 lg12>
                            <v-layout row wrap>
                                <v-flex xs6 sm6 md6 lg6>
                                    <v-text-field outlined 
                                        label="Monto Bs" 
                                        v-model="varMontoBs"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs6 sm6 md6 lg6>
                                    <v-text-field outlined 
                                        label="Monto SUS" 
                                        v-model="varMontoSus"
                                        @keyup="verificaTC()"
                                    >
                                    </v-text-field>
                                </v-flex>
                                
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-autocomplete
                                    outlined
                                    :items="cuentaContables"
                                    item-text="descripcionTotal"
                                    item-value="codigo"
                                    label="Cuenta Contable"
                                    v-model="varCuentaContable"
                                    no-data-text="Datos no disponibles"
                                    persistent-hint
                                    ></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-text-field outlined 
                                        label="Concepto" 
                                        v-model="varConceptoText"
                                    >
                                    </v-text-field>
                                </v-flex> 
                                <v-flex xs12 sm12 md12 lg12>    
                                    <v-autocomplete
                                    outlined
                                    :items="cultos"
                                    item-text="descripcion"
                                    item-value="idCulto"
                                    label="Culto"
                                    v-model="varCulto"
                                    no-data-text="Datos no disponibles"
                                    persistent-hint
                                    ></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-autocomplete
                                    outlined
                                    :items="miembros"
                                    item-text="datoCompleto"
                                    item-value="idMiembro"
                                    label="Miembro Iglesia"
                                    v-model="varMiembro"
                                    no-data-text="Datos no disponibles"
                                    persistent-hint
                                    ></v-autocomplete>
                                </v-flex>
                                <v-flex xs12 sm12 md12 lg12>
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
                                <v-flex xs12 sm12 md12 lg12>
                                    <v-textarea
                                    outlined
                                    label="Descripción"
                                    v-model="varDescripcion"
                                    >

                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                        color="primary"
                        outlined
                        @click="edita? putModificaTransaccion():registraTransaccion()"
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
         <v-dialog v-model="dialogFormTC" persistent width="600px">
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
                                v-model="valorTC"
                            >
                            </v-text-field>
                            <v-menu
                                ref="menuDateRegistro"
                                v-model="menuDateRegistroTC"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                                >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    v-model="dateFormattedRegistroTC"
                                    label="Fecha Registro"
                                    hint="dd/MM/YYYY"
                                    persistent-hint
                                    prepend-icon="event"
                                    @blur="fechaRegistroTC = parseDate(dateFormattedRegistroTC)"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="fechaRegistroTC" no-title @input="menuDateRegistroTC = false"></v-date-picker>
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
                        @click="registraTipoCambio()"
                    >
                        Guardar
                    </v-btn>
                    <v-btn
                        color="primary"
                        outlined
                        @click="dialogFormTC = false"
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
                text:'OPCIONES', 
                class: "primary white--text font-weight-bold",
            },
             {
                text:'ID', 
                class: "primary white--text font-weight-bold",
            },
            {
                text:'CULTO', 
                class: "primary white--text font-weight-bold",
            },
            {
                text:'CODIGO', 
                class: "primary white--text font-weight-bold",
                value:"usuarioModificacion"
            },
            {
                text:'CONCPETO', 
                class: "primary white--text font-weight-bold",
            },
            {
                text:'FECHA REGISTRO', 
                class: "primary white--text font-weight-bold",
                value:'tipoCuenta'
            },
            {
                text:'HOJA', 
                class: "primary white--text font-weight-bold",
                value:"descripcion"
            },
            {
                text:'MONTO BS', 
                class: "primary white--text font-weight-bold",
                value:"usuarioCreacion"
            },
            {
                text:'MONTO SUS', 
                class: "primary white--text font-weight-bold",
                value:"fechaCreacion"
            },
            {
                text:'ESTADO', 
                class: "primary white--text font-weight-bold",
                value:"estado"
            },
            { text: '', class: "primary white--text font-weight-bold" }
        ],
        listaIngresos:[],
        menuDateInicio: false,
        fechaInicio: new Date().toISOString().substr(0, 10),
        menuDateFin: false,
        menuDateRegistro: false,
        menuDateRegistroTC:false,
        fechaFin: new Date().toISOString().substr(0, 10),
        fechaRegistro: new Date().toISOString().substr(0, 10),
        dateFormattedInicio: null,
        dateFormattedFin: null,
        dateFormattedRegistro:null,
        expanded: [],
        expandido:false,
        dialogForm:false,
        cuentaContables:[],
        cultos:[],
        miembros:[],
        varIngresoEgreso:0,
        varCuentaContable:'',
        varConceptoText:'',
        varCulto:'',
        varMiembro:'',
        varMontoBs:0,
        varMontoSus:0,
        varDescripcion:'', 
        edita: false,
        faltaTipoCambio: false,
        fechaRegistroTC: new Date().toISOString().substr(0, 10),
        dateFormattedRegistroTC:null,
        dialogFormTC:false,
        valorTC:6.86,
    }),

    watch: {
      fechaInicio (val) {
        this.dateFormattedInicio = this.formatDate(this.fechaInicio)
      },
      fechaFin (val) {
        this.dateFormattedFin = this.formatDate(this.fechaFin)
      },
      fechaRegistro (val) {
        this.dateFormattedRegistro = this.formatDate(this.fechaRegistro)
      },
      fechaRegistroTC(val){
          this.dateFormattedRegistroTC = this.formatDate(this.fechaRegistroTC)
      }
    },
    mounted(){
        if(this.$store.state.session==='')
            this.$router.push("Login");
            
        let date = new Date();
        let dateini = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + '01';
        let dateFin = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        this.dateFormattedInicio = this.formatDate(dateini);
        this.dateFormattedFin = this.formatDate(dateFin);
        this.dateFormattedRegistro = this.formatDate(dateFin);
        this.obtieneCuentaContable();
        this.obtieneCulto();
        this.obtieneMiembro();
        this.listaIngresosEgresos();
        this.verificaTipoCambio();
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
        parseDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split("/");
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
        },
        listaIngresosEgresos(){
            let parametros = {
                fechaInicio : this.formatDateDB(this.dateFormattedInicio),
                fechaFin: this.formatDateDB(this.dateFormattedFin),
                tipoCuenta: 'I'
            }
            apiService
            .postObtieneIngresosEgresos(parametros)
            .then(data=>{
                let listaAuxialiar = data.data;
                for(let i=0;i < listaAuxialiar.length;i++)
                    listaAuxialiar[i].extendido = false;
                
                this.listaIngresos = listaAuxialiar;
                console.log(this.listaIngresos)
            })
            .catch(error=>{
                this.handleErrors(error);
            })
        },
        abreModal(){
            this.dialogForm = true;
            this.varCuentaContable='';
            this.varConceptoText='';
            this.varCulto='';
            this.varMiembro='';
            this.varMontoBs=0;
            this.varMontoSus=0;
            this.varDescripcion='';
            this.varIngresoEgreso = 0;
        },
        abreModalEdit(id){
            this.dialogForm = true;

            for(let i = 0; i < this.listaIngresos.length; i++ ){
                if(this.listaIngresos[i].idIngresoEgreso === id){
                    this.varIngresoEgreso = this.listaIngresos[i].idIngresoEgreso;
                    this.varCuentaContable = this.listaIngresos[i].cuentaContable.codigo;
                    this.varConceptoText = this.listaIngresos[i].concepto;
                    if(this.listaIngresos[i].culto!==null)
                        this.varCulto = this.listaIngresos[i].culto.idCulto;
                    else
                        this.varCulto='';
                    if(this.listaIngresos[i].miembro!==null)
                        this.varMiembro = this.listaIngresos[i].miembro.idMiembro;
                    else
                        this.varMiembro='';
                    this.varMontoBs = this.listaIngresos[i].montoBs;
                    this.varMontoSus = this.listaIngresos[i].montoUsd;
                    this.varDescripcion = this.listaIngresos[i].descripcion;
                    this.dateFormattedRegistro = this.formatDate(this.listaIngresos[i].fechaRegistro);   
                    this.edita = true;
                    break;
                }
            }
        },
        obtieneCuentaContable(){
            let parametros = {
                tipoCuenta:'I'
            };
            apiService
            .postCuentasContablesByTipo(parametros)
            .then(data=>{
                let aux = data.data;
                for(let i = 0;i < aux.length; i++)
                    aux[i].descripcionTotal = aux[i].codigo + ' - '+aux[i].descripcion;
                this.cuentaContables = aux;
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        obtieneCulto(){
            apiService
            .getCultos()
            .then(data=>{
                this.cultos = data.data;
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        obtieneMiembro(){
            apiService
            .getMiembros()
            .then(data=>{
                let aux = data.data;
                for(let i = 0; i<aux.length;i++)
                    aux[i].datoCompleto = aux[i].nombre + ' ' + aux[i].apellido + ' '+aux[i].tarjetaDiezmo.numeroTarjeta
                this.miembros = aux;
                
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        registraTransaccion(){
            let parametros={
                tipocuenta:'I',
                fechaRegistro: this.formatDateDBMod(this.dateFormattedRegistro),
                montoBs: this.varMontoBs,
                montoUsd: this.varMontoSus,
                descripcion: this.varDescripcion,
                cuentaContable: {codigo: this.varCuentaContable},
                concepto: this.varConceptoText,
                culto: {idCulto: this.varCulto},
                miembro: {idMiembro: this.varMiembro},
                usuarioCreacion: this.$store.state.session.usuario 
            }
            apiService
            .postRegistraTransaccion(parametros)
            .then(data=>{
                let aux = data.data;
                aux.extendido = false;
                this.dialogForm = false;
                this.listaIngresos = [];
                this.listaIngresosEgresos();
                this.mensajeDesplegar(
                    "Se registro la transacción con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        putModificaTransaccion(){
            
            let parametros={
                idIngresoEgreso:this.varIngresoEgreso,
                fechaRegistro: this.formatDateDBMod(this.dateFormattedRegistro),
                montoBs: this.varMontoBs,
                montoUsd: this.varMontoSus,
                descripcion: this.varDescripcion,
                cuentaContable: {codigo: this.varCuentaContable},
                concepto : this.varConceptoText,
                culto: {idCulto: this.varCulto},
                miembro: {idMiembro: this.varMiembro},
                usuarioModificacion: this.$store.state.session.usuario 
            };
            apiService
            .putModificaTransaccion(parametros)
            .then(data=>{
                let aux = data.data;
                aux.extendido = false;
                this.dialogForm = false;
                this.edita = false;
                this.listaIngresos = [];
                this.listaIngresosEgresos();
                this.mensajeDesplegar(
                    "Se modifico la transacción con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        cambioEstado(id){
            let parametros={
                idIngresoEgreso:id
            }
            apiService
            .postCambiaEstadoTransaccion(parametros)
            .then(data=>{
                this.listaIngresos = [];
                this.listaIngresosEgresos();
                this.mensajeDesplegar(
                    "Se cambio el estado de la transacción con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        verificaTipoCambio(){
            let parametros = {
                fecha: new Date().toISOString().substr(0, 10)
            }
            apiService
            .postVerificaTipoCambio(parametros)
            .then(data=>{
                if(data.data!=='Existe')
                    this.faltaTipoCambio = true;
                else
                    this.faltaTipoCambio = false;
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        verificaTC(){
            if(this.faltaTipoCambio){
                this.dateFormattedRegistroTC = this.formatDate(new Date().toISOString().substr(0, 10));
                this.valorTC = 6.86;
                this.dialogFormTC = true;
                this.faltaTipoCambio = false;
            }
        },
        registraTipoCambio(){
            let parametros={
                valor: this.valorTC,
                fecha: this.formatDateDBMod(this.dateFormattedRegistroTC),
                usuarioCreacion: this.$store.state.session.usuario 
            }
            apiService
            .postRegistraTipoCambio(parametros)
            .then(data=>{
                this.dialogFormTC = false;
                this.mensajeDesplegar(
                    "Se registro el tipo de cambio con exito ",
                    "success"
                    ); 
            })
            .catch(error=>{
                this.handleErrors(error);
            });
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
    }        
}
</script>