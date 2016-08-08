export interface IStoreAPI {
  area: (id: any, area: any) => any
  namespace: (ns: any) => IStoreAPI
  isFake: () => boolean
  toString: () => string
  has: (key: any) => any
  size: () => any
  each: (fn: any, and: any) => any
  keys: () => any
  get: (key: any, alt: any) => any
  getAll: () => any
  set: (key: any, data: any, overwrite: any) => any
  setAll: (data: any, overwrite: any) => any
  remove: (key: any) => any
  clear: () => any
  clearAll: () => any
  _in: (k: any) => any
  _out: (k: any) => any
}

interface IStorageAPI {
  length: number
  has: (k: any) => any
  key: (i: any) => any
  setItem: (k: any, v: any) => void
  removeItem: (k: any) => void
  getItem: (k: any) => any
  clear: () => void
  toString: () => string
}

interface I_ {
  areas: {}
  apis: {}
  inherit: (api: any, o: any) => any
  stringify: (d: any) => string
  parse: (s: any) => any
  fn: (name: any, fn: any) => void
  get: (area: any, key: any) => any
  set: (area: any, key: any, string: any) => void
  remove: (area: any, key: any) => void
  key: (area: any, i: any) => any
  length: (area: any) => any
  clear: (area: any) => void
  Store: (id: any, area: any, namespace?: any) => any
  storeAPI: IStoreAPI
  storageAPI: IStorageAPI
}

interface MyWindow extends Window {
  store: any
}

declare const window: MyWindow

const _: I_ = {
  areas: {},

  apis: {},

  // utilities
  inherit: function(api, o) {
    for (let p in api) {
      if (!o.hasOwnProperty(p)) {
        o[p] = api[p]
      }
    }
    return o
  },

  stringify: function(d) {
    return d === undefined || typeof d === 'function' ? d + '' : JSON.stringify(d)
  },

  parse: function(s) {
    // if it doesn't parse, return as is
    try{ return JSON.parse(s) }catch(e){ return s }
  },

  // extension hooks
  fn: function(name, fn) {
    _.storeAPI[name] = fn
    for (let api in _.apis) {
      _.apis[api][name] = fn
    }
  },

  get: function(area, key){ return area.getItem(key) },

  set: function(area, key, string){ area.setItem(key, string) },

  remove: function(area, key){ area.removeItem(key) },

  key: function(area, i){ return area.key(i) },

  length: function(area){ return area.length },

  clear: function(area){ area.clear() },

  // core functions
  Store: function(id, area, namespace?) {
    const store = _.inherit(_.storeAPI, function(key, data, overwrite) {
      if (arguments.length === 0) return store.getAll()
      if (data !== undefined) return store.set(key, data, overwrite)
      if (typeof key === 'string' || typeof key === 'number') return store.get(key)
      if (!key) return store.clear()
      return store.setAll(key, data)
    })
    store._id = id
    try {
      var testKey = '_safariPrivate_'
      area.setItem(testKey, 'sucks')
      store._area = area
      area.removeItem(testKey)
    } catch (e) {}
    if (!store._area) {
      store._area = _.inherit(_.storageAPI, { items: {}, name: 'fake' })
    }
    store._ns = namespace || ''
    if (!_.areas[id]) {
      _.areas[id] = store._area
    }
    if (!_.apis[store._ns+store._id]) {
      _.apis[store._ns+store._id] = store
    }
    return store
  },

  storeAPI: {
    // admin functions
    area: function(id, area) {
      var store = this[id]
      if (!store || !store.area) {
        store = _.Store(id, area, this._ns) // new area-specific api in this namespace
        if (!this[id]){ this[id] = store }
      }
      return store
    },
    namespace: function(ns) {
      if (!ns) {
        return this._ns ? this._ns.substring(0, this._ns.length-1) : ''
      }
      let store = this[ns]
      if (!store || !store.namespace) {
        store = _.Store(this._id, this._area, this._ns+ns+'.') // new namespaced api
        if (!this[ns]) this[ns] = store
      }
      return store
    },
    isFake: function(){ return this._area.name === 'fake' },
    toString: function() {
      return 'store'+(this._ns?'.'+this.namespace():'')+'['+this._id+']'
    },
    // storage functions
    has: function(key) {
      if (this._area.has) return this._area.has(this._in(key)) //extension hook
      return !!(this._in(key) in this._area)
    },
    size: function(){ return this.keys().length },
    each: function(fn, and) {
      for (var i=0, m=_.length(this._area); i<m; i++) {
        var key = this._out(_.key(this._area, i))
        if (key !== undefined) {
          if (fn.call(this, key, and || this.get(key)) === false) break
        }
        if (m > _.length(this._area)) { m--; i--; } // in case of removeItem
      }
      return and || this
    },
    keys: function() {
      return this.each(function(k, list){ list.push(k) }, [])
    },
    get: function(key, alt) {
      var s = _.get(this._area, this._in(key))
      return s !== null ? _.parse(s) : alt || s // support alt for easy default mgmt
    },
    getAll: function() {
      return this.each(function(k, all){ all[k] = this.get(k) }, {})
    },
    set: function(key, data, overwrite) {
      var d = this.get(key)
      if (d != null && overwrite === false) {
        return data
      }
      try {
        return _.set(this._area, this._in(key), _.stringify(data)) || d
      } catch(e) {
        if (e.name === 'QUOTA_EXCEEDED_ERR' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        e.toString().indexOf("QUOTA_EXCEEDED_ERR") !== -1 ||
        e.toString().indexOf("QuotaExceededError") !== -1) {
          this.clearAll()
          return
        }
        throw(e)
      }
    },
    setAll: function(data, overwrite) {
      let changed, val
      for (let key in data) {
        val = data[key]
        if (this.set(key, val, overwrite) !== val) changed = true
      }
      return changed
    },
    remove: function(key) {
      var d = this.get(key)
      _.remove(this._area, this._in(key))
      return d
    },
    clear: function() {
      if (!this._ns) {
        _.clear(this._area)
      } else {
        this.each(function(k){ _.remove(this._area, this._in(k)) }, 1)
      }
      return this
    },
    clearAll: function() {
      const area = this._area
      for (let id in _.areas) {
        if (_.areas.hasOwnProperty(id)) {
          this._area = _.areas[id]
          this.clear()
        }
      }
      this._area = area
      return this
    },
    // internal use functions
    _in: function(k) {
      if (typeof k !== 'string') k = _.stringify(k)
      return this._ns ? this._ns + k : k
    },
    _out: function(k) {
      return this._ns ?
      k && k.indexOf(this._ns) === 0 ?
      k.substring(this._ns.length) :
      undefined : // so each() knows to skip it
      k
    }
  },

  storageAPI: {
    length: 0,
    has: function(k){ return this.items.hasOwnProperty(k) },
    key: function(i) {
      let c = 0
      for (let k in this.items){
        if (this.has(k) && i === c++) return k
      }
    },
    setItem: function(k, v) {
      if (!this.has(k)) {
        this.length++
      }
      this.items[k] = v
    },
    removeItem: function(k) {
      if (this.has(k)) {
        delete this.items[k]
        this.length--
      }
    },
    getItem: function(k){ return this.has(k) ? this.items[k]: null },
    clear: function(){ for (let k in this.list){ this.removeItem(k) } },
    toString: function(){ return this.length +' items in ' + this.name + 'Storage' }
  }
}

// safely set this up (throws error in IE10/32bit mode for local files)
const store = _.Store('local', (function(){ try{ return localStorage }catch(e){}})())
store.local = store // for completeness
store._ = _ // for extenders and debuggers...

// Export
export const Store: IStoreAPI = store
