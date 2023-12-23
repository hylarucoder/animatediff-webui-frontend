import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import { createPinia } from "pinia"
import App from "./App"
import router from "./router"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"

const messages = {
  en: {
    message: {
      hello: "hello world",
    },
  },
  zh_CN: {
    message: {
      hello: "吃了么? 世界",
    },
  },
}

const i18n = createI18n({
  legacy: false,
  locale: "en", // set locale
  fallbackLocale: "en", // set fallback locale
  messages, // set locale messages
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(Antd)

// app.use(store)
app.mount("#app")
