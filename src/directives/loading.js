const loadingElement = document.createElement('div')
loadingElement.setAttribute('class', 'loading-container')
loadingElement.innerHTML = '<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div></div>'

function toggleLoadingElement (element, binding) {
  try {
    if (binding.value) {
      element.insertBefore(loadingElement, element.firstChild)
    } else if (loadingElement.parentNode) {
      element.removeChild(loadingElement)
    }
    } catch (e) { // eslint-disable-line

  }
}

function processBinding (element, binding) {
  toggleLoadingElement(element, binding)
}

function processUpdating (element, binding) {
  if (binding.modifiers) {
    if (binding.modifiers.right) {
      element.classList.add('loading-container-wrapper', 'loading_right')
    }
  }

  toggleLoadingElement(element, binding)
}

export default {
  bind: processBinding,
  update: processUpdating
}
