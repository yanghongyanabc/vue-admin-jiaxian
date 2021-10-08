import Vue from 'vue'
const urlPath = 'http://219.157.75.62:8084/'
// const urlPath = 'http://192.168.1.4:8083/'
export default {
  install() {
    Vue.prototype.$urlPath = urlPath
  }
}
