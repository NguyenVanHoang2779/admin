import numeral from 'numeral'

const updateElement = (el, binding, vnode) => {
  let content = el.innerHTML
  if (vnode.data && vnode.data.domProps && vnode.data.domProps.innerHTML) {
    content = vnode.data.domProps.innerHTML
  }

  let format = binding.modifiers.format || '0,0.0'
  let value = numeral(content).format(format)

  value = value.toString().replace(/\.0$/, '')
  el.innerHTML = value

  return el.innerHTML
}

export default {
  bind: updateElement,

  update: updateElement
}
