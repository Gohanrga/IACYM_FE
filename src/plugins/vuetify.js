import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme:{
    dark:false,
    themes:{
      primary: '#1976d2',
      secondary: '#868585',
      tertiary: '#67a9ea',

      primaryGrayScale: '#000000',
      secondaryGrayScale: '#959595',
      tertiaryGrayScale: '#ffffff',

      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107'
    }
  }
});
