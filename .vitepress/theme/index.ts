import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './custom.css'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const initZoom = () => {
      // 等 DOM 完全渲染（Mermaid SVG 是异步插入的）
      nextTick(() => {
        setTimeout(() => {
          mediumZoom('.vp-doc svg', {
            background: 'rgba(0,0,0,0.6)',
            margin: 24,
          })
        }, 500)
      })
    }

    onMounted(initZoom)
    // 路由跳转后重新绑定
    watch(() => route.path, initZoom)
  },
} satisfies Theme
