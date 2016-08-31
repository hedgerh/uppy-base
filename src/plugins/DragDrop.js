import toArray from '../utils/toArray'

/**
 * Drag & Drop Plugin
 */
export default class DragDrop {
  constructor (core, opts) {
    // Merge default options with the ones set by user
    this.opts = opts

    // Check for browser dragDrop support
    this.isDragDropSupported = this.checkDragDropSupport()

    // Bind `this` to class methods
    this.handleDrop = this.handleDrop.bind(this)
    this.checkDragDropSupport = this.checkDragDropSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 * @return {Boolean} true if supported, false otherwise
 */
  checkDragDropSupport () {
    const div = document.createElement('div')

    if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
      return false
    }

    if (!('FormData' in window)) {
      return false
    }

    if (!('FileReader' in window)) {
      return false
    }

    return true
  }

  handleDrop (handler, source, files) {
    // this.core.log('All right, someone dropped something...')

    if (!handler) {
      return files.map((file) => {
        return {
          source: source || null,
          name: file.name,
          type: file.type,
          data: file
        }
      })
    }

    files.forEach((file) => {
      handler({
        source: source || null,
        name: file.name,
        type: file.type,
        data: file
      })
    })
  }

  handleInputChange (handler, ev) {
    this.core.log('All right, something selected through input...')

    const files = toArray(ev.target.files)

    if (!handler) {
      return files.map((file) => {
        return {
          source: source || null,
          name: file.name,
          type: file.type,
          data: file
        }
      })
    }

    files.forEach((file) => {
      handler({
        source: source || null,
        name: file.name,
        type: file.type,
        data: file
      })
    })
  }
}
