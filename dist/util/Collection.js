// @ts-nocheck
'use strict';
const DJSCollection = require('@discordjs/collection');
const EventEmitter = require('events');
const Coll = DJSCollection.default || DJSCollection;
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
        var _a;
        if (typeof value === 'object')
            value.cache = this;
        (_a = this.events) === null || _a === void 0 ? void 0 : _a.emit('changed', key);
        // console.log('collection set ' + key, value);
        return super.set(key, value);
    }
    delete(key) {
        var _a;
        (_a = this.events) === null || _a === void 0 ? void 0 : _a.emit('changed', key);
        return super.delete(key);
    }
    array() {
        return Array.from(this, ([name, value]) => value);
    }
}
module.exports = Collection;
