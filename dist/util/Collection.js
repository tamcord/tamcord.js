'use strict';
const BaseCollection = require('@discordjs/collection');
const Util = require('./Util');
class Collection extends BaseCollection {
    toJSON() {
        return this.map(e => (typeof (e === null || e === void 0 ? void 0 : e.toJSON) === 'function' ? e.toJSON() : Util.flatten(e)));
    }
}
module.exports = Collection;
