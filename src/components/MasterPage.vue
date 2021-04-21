<template>
    <v-app>
        <v-navigation-drawer
        v-if="$store.state.session!==''"
        :clipped="$vuetify.breakpoint.lgAndUp"
        v-model="drawer"
        app
        style="background-color: #191616"
        >
            <Menu></Menu>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" 
                    app 
                    class = "indigo darken-3" 
                    style="color: white;">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
            <v-toolbar-title class="headline text-uppercase">
                <span>
                    <v-btn to="/InicioLogin" outlined class="white--text">IACYM</v-btn>
                </span>
            </v-toolbar-title>
            <v-spacer/>
            <v-menu
                v-model="menuDesplegable"
                :close-on-content-click="false"
                :nudge-width="300"
                offset-x
                >
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        large
                        color="green"
                        v-on="on"
                    >
                        <v-avatar
                        size="45px"
                        item
                        >
                            <v-icon large color="white">mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-card>
                    <v-list>
                    <v-list-item v-if="$store.state.session!==''">
                        <v-list-item-avatar>
                            <v-avatar color="teal" size="48">
                                <span class="white--text headline">AM</span>
                            </v-avatar>
                        </v-list-item-avatar>

                        <v-list-item-content>
                        <v-list-item-title>CREDENCIALES</v-list-item-title>
                        <v-list-item-subtitle>{{$store.state.session.nombre + ' ' +$store.state.session.apellido}}</v-list-item-subtitle>
                        </v-list-item-content>

                    </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list>
                        <v-list-item>
                            <v-list-item-title>
                                Vivimos por fe, no por vista.
                                2 Corintios 5:7
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text @click="menuDesplegable = false">Salir</v-btn>
                        <v-btn color="primary" 
                            text 
                            @click="cerrarSession()"
                            v-if="$store.state.session!==''">
                            Cerrar Sessión
                        </v-btn>
                        <v-btn color="primary" 
                            text 
                            @click="$router.push('/Login')"
                            v-if="$store.state.session===''">
                            Login
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-app-bar>
        <v-content app fixed fluid class="pa-1" >
            <v-container app fixed fluid class="pa-1">
                <br>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer
            color="primary lighten-1"
            padless
        >
            <v-row
            justify="center"
            no-gutters
            >
                <v-col
                    class="blue darken-4 lighten-2 py-4 text-center white--text"
                    cols="12"
                >
                    {{ new Date().getFullYear() }} — <strong>Alianza Cristiana y Misionera</strong>
                </v-col>
            </v-row>
        </v-footer>
    </v-app>
</template>
<script>
import Menu from '../views/Menu';
export default {
    components:{
        Menu
    },
    data:()=>({
        drawer:true,
        links: [
            'Inicio',
            'Ingresos',
            'Egresos',
            'Cuentas Contables',
        ],
        menuDesplegable:false
    }),
    methods:{
        cerrarSession(){
            this.menuDesplegable=false;
            this.$store.commit("login", '');
            this.$router.push("Login");
        }
    }
}
</script>