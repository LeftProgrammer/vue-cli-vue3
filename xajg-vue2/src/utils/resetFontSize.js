export default function resetFontSize() {
  function setRem() {
    const b = document.documentElement.clientWidth
    const c = b / 1920 * 16
    document.getElementsByTagName('html')[0].style.fontSize = c + 'px'
  }

  setRem()

  // onresize 回调数组
  window.resizeCallbackList = [setRem]
  window.onresize = () => {
    window.resizeCallbackList.map(callback => {
      callback()
    })
  }
}
