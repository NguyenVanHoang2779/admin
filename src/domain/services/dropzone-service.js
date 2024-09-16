import Dropzone from '@/vendor/libs/dropzone-extend/dropzone-extend'

export default {
  /**
   * Create new dropzone instance
   * @param {HTMLElement} element
   * @param {Object} options
   *
   * @returns {Dropzone}
   */
  createDropzone (element, options = {}) {
    const config = Object.assign({}, {
      method: 'post',
      filesizeBase: 1024,
      maxFilesize: 1024 * 1024 * 100, // 100MB
      addRemoveLinks: true,
      chunking: true,
      chunkSize: 1024 * 1024 * 5, // 5MB
      parallelChunkUploads: 20,
      retryChunks: true,
      retryChunksLimit: 3,
      disablePreviews: true,
      autoProcessQueue: true
    }, options)

    return new Dropzone(element, config)
  }
}
