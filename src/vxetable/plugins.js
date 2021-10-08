import Vue from 'vue'
// 防重复点击(指令实现)
Vue.directive('preventReClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000)
      }
    })
  }
})

// 只能输入正整数及小数 包含小数点
Vue.directive('enterNumber', {
  inserted: function(el) {
    el.addEventListener('keypress', function(e) {
      e = e || window.event
      const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
      const re = /\d/
      if (charcode === 46) {
        if (el.value.includes('.')) {
          e.preventDefault()
        }
        return
      } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
  }
})

