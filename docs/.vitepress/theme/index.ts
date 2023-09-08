import './custom.css'
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout,
  async enhanceApp({ app }) {
    const appearance = localStorage.getItem("vitepress-theme-appearance");
    if(appearance == undefined || appearance == null){
        localStorage.setItem("vitepress-theme-appearance", "dark");
    }
  }
}