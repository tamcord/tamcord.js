// @ts-nocheck
'use strict';

const {Collection: Coll} = require('@discordjs/collection');
const EventEmitter = require('events');

console.log(Coll);
/**
 * A Collection which holds a max amount of entries and sweeps periodically.
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 */
class Collection extends Coll {
  constructor(iterable) {
    super(iterable);

    this.events = new EventEmitter();
  }

  set(key, value) {
    this.events.emit('changed', key);
    return super.set(key, value);
  }

  delete(key) {
    this.events.emit('changed', key);
    return super.delete(key);
  }

  // static get [Symbol.species]() {
  //   return Collection;
  // }
}

module.exports = Collection;
