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
const Team = require('./Team');
const Application = require('./interfaces/Application');
const ApplicationCommandManager = require('../managers/ApplicationCommandManager');
const ApplicationFlags = require('../util/ApplicationFlags');
/**
 * Represents a Client OAuth2 Application.
 * @extends {Application}
 */
class ClientApplication extends Application {
    constructor(client, data) {
        super(client, data);
        /**
         * The application command manager for this application
         * @type {ApplicationCommandManager}
         */
        this.commands = new ApplicationCommandManager(this.client);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        super._patch(data);
        /**
         * The flags this application has
         * @type {ApplicationFlags}
         */
        this.flags = 'flags' in data ? new ApplicationFlags(data.flags).freeze() : this.flags;
        /**
         * The hash of the application's cover image
         * @type {?string}
         */
        this.cover = (_b = (_a = data.cover_image) !== null && _a !== void 0 ? _a : this.cover) !== null && _b !== void 0 ? _b : null;
        /**
         * The application's RPC origins, if enabled
         * @type {string[]}
         */
        this.rpcOrigins = (_d = (_c = data.rpc_origins) !== null && _c !== void 0 ? _c : this.rpcOrigins) !== null && _d !== void 0 ? _d : [];
        /**
         * If this application's bot requires a code grant when using the OAuth2 flow
         * @type {?boolean}
         */
        this.botRequireCodeGrant = (_f = (_e = data.bot_require_code_grant) !== null && _e !== void 0 ? _e : this.botRequireCodeGrant) !== null && _f !== void 0 ? _f : null;
        /**
         * If this application's bot is public
         * @type {?boolean}
         */
        this.botPublic = (_h = (_g = data.bot_public) !== null && _g !== void 0 ? _g : this.botPublic) !== null && _h !== void 0 ? _h : null;
        /**
         * The owner of this OAuth application
         * @type {?(User|Team)}
         */
        this.owner = data.team
            ? new Team(this.client, data.team)
            : data.owner
                ? this.client.users._add(data.owner)
                : (_j = this.owner) !== null && _j !== void 0 ? _j : null;
    }
    /**
     * Whether this application is partial
     * @type {boolean}
     * @readonly
     */
    get partial() {
        return !this.name;
    }
    /**
     * Obtains this application from Discord.
     * @returns {Promise<ClientApplication>}
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.client.api.oauth2.applications('@me').get();
            this._patch(app);
            return this;
        });
    }
}
module.exports = ClientApplication;
