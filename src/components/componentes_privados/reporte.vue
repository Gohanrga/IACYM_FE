<template>
    <v-layout align-center justify-center wrap row >
        <v-flex xs11 sm11 md11 lg11>
            <span class="headline font-weight-bold primary--text">Cuenta Contable</span>
            <v-divider class="primary"></v-divider>
            <br>
        </v-flex>
        <v-flex xs11 sm11 md11 lg11>
            <v-layout wrap align-center justify-center>
                <v-flex xs11 sm11 md11 lg11>
                    <v-select
                    :items="items"
                    item-text="descripcion"
                    item-value="id"
                    v-model="reporte"
                    label="Reportes"
                    outlined
                    @change="muestraCampos()"
                    ></v-select>
                </v-flex>
                <v-flex xs11 sm11 md11 lg11 v-if="muestraFecha">
                    <v-menu
                        ref="menuDate"
                        v-model="menuDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                        >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            v-model="dateFormatted"
                            label="Fecha"
                            hint="dd/MM/YYYY"
                            persistent-hint
                            prepend-icon="event"
                            v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="fecha" no-title @input="menuDate = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs11 sm11 md11 lg11 v-if="muestraMes">
                    <v-date-picker v-model="mes" :landscape="false" type="month"></v-date-picker>
                </v-flex>
                <v-flex xs11 sm11 md11 lg11 v-if="muestraCuenta">
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
                <v-flex xs11 sm11 md11 lg11>
                    <br>
                    <v-btn color="primary" @click="generaReporte()">Imprimir</v-btn>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
import {APIService} from '../../APIService';
const apiService = new APIService();
export default {
    data:()=>({
        menuDate: false,
        dateFormatted: null,
        fecha: new Date().toISOString().substr(0, 10),
        reporte:'',
        cuentaContables:[],
        varCuentaContable:'',
        mes:'',
        muestraFecha: false,
        muestraMes: false,
        muestraCuenta: false, 
        fechaActual:'',
        items:[{id:1, descripcion:'Resumen Domingo'},
               {id:2, descripcion:'Resumen Diezmos y Ofrendas'},
               {id:3, descripcion:'Recaudaciones'},
               {id:4, descripcion:'Promesas de fe'},
               {id:5, descripcion:'Movimiento Mensual'}
               ],
        meses:[{id:1, mes:'Enero'},
               {id:2, mes:'Febrero'},
               {id:3, mes:'Marzo'},
               {id:4, mes:'Abril'},
               {id:5, mes:'Mayo'},
               {id:6, mes:'Junio'},
               {id:7, mes:'Julio'},
               {id:8, mes:'Agosto'},
               {id:9, mes:'Septiembre'},
               {id:10, mes:'Octubre'},
               {id:11, mes:'Noviembre'},
               {id:12, mes:'Diciembre'}]
    }),
    mounted() {
        this.obtieneCuentasIngresos();
        let d = new Date();
        this.fechaActual = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    },
    watch: {
      fecha (val) {
        this.dateFormatted = this.formatDate(this.fecha)
      },
    },
    methods:{
        generaReporte(){
            let parametros = {
                
            }
            if(this.reporte===1){
                parametros.paFecha = this.formatDateDB(this.dateFormatted);
                parametros.fechaString = this.formatDateString(this.dateFormatted);
                window.open(apiService.getReporteDomingo(parametros));
            }
            if(this.reporte===2){
                parametros.paMes = this.obtieneMes(this.mes)
                parametros.paMesLiteral = this.formatDateString(this.dateFormatted);
                window.open(apiService.getReporteResumenDiezmo(parametros));
            }
            if(this.reporte===3){
                parametros.paFecha = this.formatDateDB(this.dateFormatted);
                parametros.fechaString = this.formatDateString(this.dateFormatted);
                parametros.paCodigo = this.varCuentaContable;
                window.open(apiService.getReporteRecaudaciones(parametros));
            }
            if(this.reporte===4){
                parametros.paMes = this.obtieneMes(this.mes)
                window.open(apiService.getReportePromesasDeFe(parametros));
            }
            if(this.reporte===5){
                 const [year, month] = this.mes.split("-");
                parametros.paMes = month
                parametros.paFechaString = this.formatDateString(this.fechaActual);
                parametros.paAnio = year;
                console.log(parametros);
                window.open(apiService.getMovimientosMensuales(parametros));
            }
        },
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
        formatDateString(date){
            if (!date) return null;
            let meses = ['Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const [day, month, year] = date.split("/");
            return day + ' de ' + meses[month-1] +' '+ year;
        },
        obtieneMes(date){
            const [year, month] = date.split("-");
            return month;
        },
        obtieneCuentasIngresos(){
            console.log('entra')
            let parameters={
                tipoCuenta:'I'
            };
            apiService
            .postCuentasContablesByTipo(parameters)
            .then(data=>{
                console.log('entra')
                let aux = data.data;
                for(let i = 0;i < aux.length; i++)
                    aux[i].descripcionTotal = aux[i].codigo + ' - '+aux[i].descripcion;
                this.cuentaContables = aux;
            })
            .catch(error=>{
                this.handleErrors(error);
            });
        },
        muestraCampos(){
            switch (this.reporte) {
                case 1:
                    this.muestraFecha = true;
                    this.muestraMes = false;
                    this.muestraCuenta = false;
                    break;
                case 2:
                    this.muestraFecha = false;
                    this.muestraMes = true;
                    this.muestraCuenta = false;
                    break;
                case 3:
                    this.muestraFecha = true;
                    this.muestraMes = false;
                    this.muestraCuenta = true;
                    break;
                case 4:
                    this.muestraFecha = false;
                    this.muestraMes = true;
                    this.muestraCuenta = true;
                    break;
                case 5:
                    this.muestraFecha = false;
                    this.muestraMes = true;
                    this.muestraCuenta = false;
                    break;
                default:
                    break;
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
    }
}
</script>