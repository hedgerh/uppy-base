'use strict'

const _getName = (id) => {
  return id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

export default class Remote extends EventEmitter {
  constructor (opts) {
    super (opts)
    this.opts = opts
    this.id = opts.provider
    this.name = this.opts.name || _getName(this.id)
  }

  getInitialState () {
    return {
      [this.id]: {
        id: this.id,
        name: this.name,
        files: {},
        authed: false,
        authURL: `${this.opts.host}/connect/${this.id}`,
        auth: this.auth,
        list: this.list,
        logout: this.logout
      }
    }
  }

  auth () {
    return fetch(`${this.opts.host}/${this.id}/authorize`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application.json'
      }
    })
    .then((res) => {
      return res.json()
      .then((payload) => {
        return payload.isAuthenticated
      })
    })
  }

  list (directory = 'root') {
    return fetch(`${this.opts.host}/${this.id}/list?dir=${directory}`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
  }

  logout (redirect = location.href) {
    return fetch(`${this.opts.host}/${this.id}/logout?redirect=${redirect}`, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
}
