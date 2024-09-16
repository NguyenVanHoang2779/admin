const addScrollEvent = function (el, binding) {
  let f = function (evt) {
    if (binding.value(evt, el)) {
      el.removeEventListener('scroll', f)
    }
  }
  el.addEventListener('scroll', f)
}

export default {
  inserted: addScrollEvent
}
