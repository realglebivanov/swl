import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { YandexDictionary } from './services/yandex.dictionary'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App)
app.config.globalProperties.$yandexDictionary =
    new YandexDictionary(
        'dict.1.1.20220918T214714Z.712dfcb43dacbf0e.8dacdffcf53ff5f9aadaecc72e22f0c8649ae192')

app.use(createPinia())

app.mount('#app')
