import axios from 'axios';

//const APIBISA_URL = "http://localhost:8080/api/";

const APIBISA_URL = "https://iacymbk-prb.herokuapp.com/api/";

export class APIService {
  constructor() {
        /*
        * Se setea el timeout para el axios a 10 minutos como máximo
        */
        axios.defaults.timeout = 60 * 10 * 1000;
    }

  consultaPost(paUrl, parametros){
    const url = `${APIBISA_URL}` + paUrl;
    return axios.post(url, parametros);
  }  

  consultaPut(paUrl, parametros){
    const url = `${APIBISA_URL}` + paUrl;
    return axios.put(url, parametros);
  }  

  consultaGet(paUrl, parametros){
    const url = `${APIBISA_URL}` + paUrl;
    return axios.get(url, parametros);
  }
  consultaDelete(paUrl, id){
    const url = `${APIBISA_URL}` + paUrl + id;
    return axios.delete(url);
  }
  /**
   * Roger Gonzales Aparicio 
   * @param {*} parametros 
   */
  postLogin(parametros) {
    return this.consultaPost('logueo/', parametros);
  }

  /**
   * Servicios para listar 
   */
  getUsuarios(){
    return this.consultaGet('listarUsuario/','');
  }

  getTiposConceptos(){
    return this.consultaGet('listarConceptos/','');
  } 

  getCuentasContables(){
    return this.consultaGet('listarCuentas/','');
  }

  postCuentasContablesByTipo(parametros){
    return this.consultaPost('listarCuentasByTipo/',parametros);
  }

  getMiembros(){
    return this.consultaGet('listarMiembros/','');
  }

  getTarjetaDiezmo(){
    return this.consultaGet('listarTarjetas/','');
  }

  getCultos(){
    return this.consultaGet('listarCultos/','');
  }

  getTipoCambios(){
    return this.consultaGet('listarTipoCambio/','')
  }

  getReporte(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "reporteComprobante/" + btoa(JSON.stringify(parametros));
    return url;
  }

  getReporteDomingo(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "reporteDomingo/" + btoa(JSON.stringify(parametros));
    return url;
  }

  getReporteResumenDiezmo(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "resumenDiezmos/" + btoa(JSON.stringify(parametros));
    return url;
  }

  getReporteRecaudaciones(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "resumenRecaudaciones/" + btoa(JSON.stringify(parametros));
    return url;
  }

  getReportePromesasDeFe(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "resumenPromesas/" + btoa(JSON.stringify(parametros));
    return url;
  }

  getMovimientosMensuales(parametros){
    let url = `${APIBISA_URL}`;
    url = url + "movimientosMensuales/" + btoa(JSON.stringify(parametros));
    return url;
  }

  postObtieneIngresosEgresos(parametros){
    return this.consultaPost('getTransacciones/', parametros);
  }
  postCambiaEstadoTransaccion(parametros){
    return this.consultaPost('inactivarTransaccion/', parametros);
  }
  postVerificaTipoCambio(parametros){
    return this.consultaPost('verifica/', parametros);
  }
  /**
   * SErvicios de registro
   */
  postRegistroUsuario(parametros){
    return this.consultaPost('registroUsuario/', parametros);
  } 

  postTipoConcepto(parametros){
    return this.consultaPost('registroConcepto/', parametros);
  }

  postRegistroCuenta(parametros){
    return this.consultaPost('registroCuenta/', parametros);
  }

  postRegistraMiembros(parametros){
    return this.consultaPost('registroMiembro/', parametros);
  }

  postRegistraTransaccion(parametros){
    return this.consultaPost('registroTransaccion/', parametros);
  }

  postRegistraTipoCambio(parametros){
    return this.consultaPost('registroTipoCuenta/', parametros);
  }
  /**
   * Servicios de modificacion
   */
  putModificaUsuario(parametros){
    return this.consultaPut('modificaUsuario/', parametros);
  }

  putModificaTipoConcepto(parametros){
    return this.consultaPut('modificaConcepto/', parametros);
  }

  putModificaCuentaContable(parametros){
    return this.consultaPut('modificaCuenta/', parametros);
  }
  putModificaMiembro(parametros){
    return this.consultaPut('modificaMiembro/', parametros);
  }
  putModificaTransaccion(parametros){
    return this.consultaPut('modificaTransaccion/', parametros);
  }
  putModificaTipoCambio(parametros){
    return this.consultaPut('modificaTipoCuenta/', parametros);
  }
  /**
   * Servicios de eliminacion
   */
  deleteEliminaUsuario(id){
    return this.consultaDelete('eliminaUsuario/',id);
  }

  deleteTipoConcepto(id){
    return this.consultaDelete('eliminaConcepto/',id);
  }

  deleteCuentaContable(codigo){
    return this.consultaDelete('eliminaCuenta/',codigo);
  }
}