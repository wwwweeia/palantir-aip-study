import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './custom.css'
import type { Theme } from 'vitepress'

let zoomInstance: ReturnType<typeof mediumZoom> | null = null

function attachZoom() {
  const svgs = [...document.querySelectorAll<SVGElement>('.vp-doc svg')]
  if (svgs.length === 0) return
  if (zoomInstance) zoomInstance.detach()
  zoomInstance = mediumZoom(svgs, { background: 'rgba(0,0,0,0.65)', margin: 32 })
}

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const initZoom = () => {
      nextTick(() => {
        // Mermaid 是客户端异步渲染，用 MutationObserver 等 SVG 真正插入后再绑
        const observer = new MutationObserver(() => {
          const svgs = document.querySelectorAll('.vp-doc svg')
          if (svgs.length > 0) {
            attachZoom()
            observer.disconnect()
          }
        })
        observer.observe(document.getElementById('app') ?? document.body, {
          childList: true,
          subtree: true,
        })
        // 8秒后兜底断开，避免内存泄漏
        setTimeout(() => observer.disconnect(), 8000)
        // 如果 SVG 已经渲染好了（路由切换复用页面时），直接绑
        attachZoom()
      })
    }

    onMounted(initZoom)
    watch(() => route.path, initZoom)
  },
} satisfies Theme
