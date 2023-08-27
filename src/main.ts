import { createApp } from 'vue'
import './style.css'
//import 'bootstrap/dist/css/bootstrap.css'
//import 'font-awesome/css/font-awesome.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSun, faMoon, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import { store, key } from './store';

library.add(faSun);
library.add(faMoon);
library.add(faArrowLeft);
library.add(faArrowRight);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store, key);
app.mount('#app');
