export default class Provider {
  constructor (opts) {
    this.opts = opts
  }

  list (directory) {
    return fetch(`${this.opts.host}/${this.opts.provider}/list?dir=${directory}`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  logout (redirect) {
    return fetch(`${this.opts.host}/${this.opts.provider}/logout?redirect=${redirect}`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}
