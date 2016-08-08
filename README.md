A feature-filled and friendly way to take advantage of localStorage and sessionStorage
(JSON, namespacing, extensions, etc).

[NPM][npm]: `npm install store2`

[prod]: https://raw.github.com/nbubna/store/master/dist/store2.min.js
[dev]: https://raw.github.com/nbubna/store/master/dist/store2.js
[npm]: https://npmjs.org/package/store2

## Documentation
The main store function can handle ```set```, ```get```, ```setAll```, ```getAll``` and ```clear```
actions directly. Respectively, these are called like so:

```javascript
store(key, data);                 // sets stringified data under key
store(key);                       // gets and parses data stored under key
store({key: data, key2: data2});  // sets all key/data pairs in the object
store();                          // gets all stored key/data pairs as an object
store(false);                     // clears all items from storage
```

There are also more explicit and versatile functions available:

```javascript
store.set(key, data[, overwrite]); // === store(key, data);
store.setAll(data[, overwrite]);   // === store({key: data, key2: data});
store.get(key[, alt]);             // === store(key);
store.getAll();                    // === store();
store.clear();                     // === store(false);
store.has(key);                    // returns true or false
store.remove(key);                 // removes key and its data
store.each(callback);              // called with key and data args, return false to exit early
store.keys();                      // returns array of keys
store.size();                      // number of keys, not length of data
store.clearAll();                  // clears *ALL* areas (but still namespace sensitive)
```

Passing in ```false``` for the optional overwrite parameters will cause ```set``` actions to be skipped
if the storage already has a value for that key. All ```set``` action methods return the previous value
for that key, by default. If overwrite is ```false``` and there is a previous value, the unused new
value will be returned.

All of these use the browser's localStorage (aka "local"). Using sessionStorage merely requires
calling the same functions on ```store.session```:

```javascript
store.session("addMeTo", "sessionStorage");
store.local({lots: 'of', data: 'altogether'});// store.local === store :)
```
All the specific ```get```, ```set```, etc. functions are available on both ```store.session``` and ```store.local```, as well as any other storage facility registered via ```store.area(name, customStorageObject)``` by an extension, where customStorageObject must implement the [Storage interface][storage]. This is how [store.old.js][old] extends store.js to support older versions of IE and Firefox.

[storage]: http://dev.w3.org/html5/webstorage/#the-storage-interface

If you want to put stored data from different pages or areas of your site into separate namespaces,
the ```store.namespace(ns)``` function is your friend:

```javascript
var cart = store.namespace('cart');
cart('total', 23.25);// stores in localStorage as 'cart.total'
console.log(store('cart.total') == cart('total'));// logs true
console.log(store.cart.getAll());// logs {total: 23.25}
cart.session('group', 'toys');// stores in sessionStorage as 'cart.group'
```

The namespace provides the same exact API as ```store``` but silently adds/removes the namespace prefix as needed.
It also makes the namespaced API accessible directly via ```store[namespace]``` (e.g. ```store.cart```) as long as it
does not conflict with an existing part of the store API.

The 'namespace' function is one of two "extra" functions that are also part of the "store API":

```javascript
store.namespace(prefix[, noSession]);// returns a new store API that prefixes all key-based functions
store.isFake();// is this storage persistent? (e.g. is this old IE?)
```

## Store vs Store
When i went to publish this on NPM i discovered another [store.js][other] by Marcus Westin.
To my surprise, even our APIs had notable overlap. His has fewer features and includes superior support
for IE 6/7 in the main lib. I contacted him with the idea of merging the featuresets, but we agreed it wouldn't work.
He sees his library as a temporary polyfill meant to fade away with IE 6/7. This project is meant
to always be useful, as a better way to use localStorage, with polyfilling as an extension.  I do hope
to incorporate IE 6/7 improvements from the other store.js into store.old.js at some point,
but it is not a priority.

To minimize confusion, i will be publishing the library as 'store2',
but the main function will always be `store`.
My apologies for the confusion caused while i was publishing this as another 'store'.

[other]: https://github.com/marcuswestin/store.js/


