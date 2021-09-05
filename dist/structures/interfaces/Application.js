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
const { ClientApplicationAssetTypes, Endpoints } = require('../../util/Constants');
const SnowflakeUtil = require('../../util/SnowflakeUtil');
const Base = require('../Base');
const AssetTypes = Object.keys(ClientApplicationAssetTypes);
/**
 * Represents an OAuth2 Application.
 * @abstract
 */
class Application extends Base {
    constructor(client, data) {
        super(client);
        this._patch(data);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e, _f;
        /**
         * The application's id
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The name of the application
         * @type {?string}
         */
        this.name = (_b = (_a = data.name) !== null && _a !== void 0 ? _a : this.name) !== null && _b !== void 0 ? _b : null;
        /**
         * The application's description
         * @type {?string}
         */
        this.description = (_d = (_c = data.description) !== null && _c !== void 0 ? _c : this.description) !== null && _d !== void 0 ? _d : null;
        /**
         * The application's icon hash
         * @type {?string}
         */
        this.icon = (_f = (_e = data.icon) !== null && _e !== void 0 ? _e : this.icon) !== null && _f !== void 0 ? _f : null;
    }
    /**
     * The timestamp the application was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time the application was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * A link to the application's icon.
     * @param {StaticImageURLOptions} [options={}] Options for the Image URL
     * @returns {?string}
     */
    iconURL({ format, size } = {}) {
        if (!this.icon)
            return null;
        return this.client.rest.cdn.AppIcon(this.id, this.icon, { format, size });
    }
    /**
     * A link to this application's cover image.
     * @param {StaticImageURLOptions} [options={}] Options for the Image URL
     * @returns {?string}
     */
    coverURL({ format, size } = {}) {
        if (!this.cover)
            return null;
        return Endpoints.CDN(this.client.options.http.cdn).AppIcon(this.id, this.cover, { format, size });
    }
    /**
     * Asset data.
     * @typedef {Object} ApplicationAsset
     * @property {Snowflake} id The asset's id
     * @property {string} name The asset's name
     * @property {string} type The asset's type
     */
    /**
     * Gets the application's rich presence assets.
     * @returns {Promise<Array<ApplicationAsset>>}
     */
    fetchAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const assets = yield this.client.api.oauth2.applications(this.id).assets.get();
            return assets.map(a => ({
                id: a.id,
                name: a.name,
                type: AssetTypes[a.type - 1],
            }));
        });
    }
    /**
     * When concatenated with a string, this automatically returns the application's name instead of the
     * Oauth2Application object.
     * @returns {?string}
     * @example
     * // Logs: Application name: My App
     * console.log(`Application name: ${application}`);
     */
    toString() {
        return this.name;
    }
    toJSON() {
        return super.toJSON({ createdTimestamp: true });
    }
}
module.exports = Application;
