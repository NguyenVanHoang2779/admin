const addResizeEvent = function (el, binding) {
  let f = function (evt) {
    if (binding.value(evt, el)) {
      el.removeEventListener('resize', f)
    }
  }
  el.addEventListener('resize', f)
}

export default {
  inserted: addResizeEvent
}
