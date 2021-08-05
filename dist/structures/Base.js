// @ts-nocheck
'use strict';
const Util = require('../util/Util');
/**
 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
 * @abstract
 */
class Base {
    constructor(client) {
        /**
         * The client that instantiated this
         * @name Base#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });
    }
    _clone() {
        return Object.assign(Object.create(this), this);
    }
    _patch(data) {
        // console.log('_patch guild', this);
        if (this.cache)
            this.cache.events.emit('changed', this);
        return data;
    }
    _update(data) {
        // console.log('_update guild', this);
        const clone = this._clone();
        if (this.cache)
            this.cache.events.emit('changed', this);
        this._patch(data);
        return clone;
    }
    toJSON(...props) {
        return Util.flatten(this, ...props);
    }
    valueOf() {
        return this.id;
    }
}
module.exports = Base;
