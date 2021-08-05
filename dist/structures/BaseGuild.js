// @ts-nocheck
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Base = require('./Base');
const SnowflakeUtil = require('../util/SnowflakeUtil');
/**
 * The base class for {@link Guild}, {@link OAuth2Guild} and {@link InviteGuild}.
 * @extends {Base}
 * @abstract
 */
class BaseGuild extends Base {
    constructor(client, data) {
        super(client);
        /**
         * The guild's id
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The name of this guild
         * @type {string}
         */
        this._name = data.name;
        /**
         * The icon hash of this guild
         * @type {?string}
         */
        this.icon = data.icon;
        /**
         * An array of features available to this guild
         * @type {Features[]}
         */
        this.features = data.features;
    }
    /**
     * The timestamp this guild was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time this guild was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    get name() {
        if (!this._name)
            return 'unavailable';
        return this._name;
    }
    set name(val) {
        this._name = val;
    }
    /**
     * The acronym that shows up in place of a guild icon
     * @type {string}
     * @readonly
     */
    get nameAcronym() {
        if (!this.name)
            return 'unavailable';
        return this.name
            .replace(/'s /g, ' ')
            .replace(/\w+/g, e => e[0])
            .replace(/\s/g, '');
    }
    /**
     * Whether this guild is partnered
     * @type {boolean}
     * @readonly
     */
    get partnered() {
        return this.features.includes('PARTNERED');
    }
    /**
     * Whether this guild is verified
     * @type {boolean}
     * @readonly
     */
    get verified() {
        return this.features.includes('VERIFIED');
    }
    /**
     * The URL to this guild's icon.
     * @param {ImageURLOptions} [options={}] Options for the Image URL
     * @returns {?string}
     */
    iconURL({ format, size, dynamic } = {}) {
        if (!this.available)
            return 'https://cdn1.iconfinder.com/data/icons/feather-2/24/clock.svg';
        if (!this.icon)
            return null;
        return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
    }
    /**
     * Fetches this guild.
     * @returns {Promise<Guild>}
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.api.guilds(this.id).get({ query: { with_counts: true } });
            return this.client.guilds._add(data);
        });
    }
    /**
     * When concatenated with a string, this automatically returns the guild's name instead of the Guild object.
     * @returns {string}
     */
    toString() {
        return this.name;
    }
}
module.exports = BaseGuild;
