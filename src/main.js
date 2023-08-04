import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
//import firebase from 'firebase/app';
//import 'firebase/firestore';

const originalObserver = window.ResizeObserver;

class MyResizeObserver {
  constructor(cb) {
    return new originalObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        cb(entries);
      });
    });
  }
}

window.ResizeObserver = MyResizeObserver;

const app = createApp(App, {
    // Change the name of the app
    name: '360Quote',
  });

app.use(vuetify).mount('#app');


//createApp(App).use(vuetify).mount('#app');
