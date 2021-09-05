// @ts-nocheck
'use strict';
const Application = require('./interfaces/Application');
/**
 * Represents an Integration's OAuth2 Application.
 * @extends {Application}
 */
class IntegrationApplication extends Application {
    _patch(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        super._patch(data);
        /**
         * The bot user for this application
         * @type {?User}
         */
        this.bot = data.bot ? this.client.users._add(data.bot) : (_a = this.bot) !== null && _a !== void 0 ? _a : null;
        /**
         * The url of the application's terms of service
         * @type {?string}
         */
        this.termsOfServiceURL = (_c = (_b = data.terms_of_service_url) !== null && _b !== void 0 ? _b : this.termsOfServiceURL) !== null && _c !== void 0 ? _c : null;
        /**
         * The url of the application's privacy policy
         * @type {?string}
         */
        this.privacyPolicyURL = (_e = (_d = data.privacy_policy_url) !== null && _d !== void 0 ? _d : this.privacyPolicyURL) !== null && _e !== void 0 ? _e : null;
        /**
         * The Array of RPC origin urls
         * @type {string[]}
         */
        this.rpcOrigins = (_g = (_f = data.rpc_origins) !== null && _f !== void 0 ? _f : this.rpcOrigins) !== null && _g !== void 0 ? _g : [];
        /**
         * The application's summary
         * @type {?string}
         */
        this.summary = (_j = (_h = data.summary) !== null && _h !== void 0 ? _h : this.summary) !== null && _j !== void 0 ? _j : null;
        /**
         * Whether the application can be default hooked by the client
         * @type {?boolean}
         */
        this.hook = (_l = (_k = data.hook) !== null && _k !== void 0 ? _k : this.hook) !== null && _l !== void 0 ? _l : null;
        /**
         * The hash of the application's cover image
         * @type {?string}
         */
        this.cover = (_o = (_m = data.cover_image) !== null && _m !== void 0 ? _m : this.cover) !== null && _o !== void 0 ? _o : null;
        /**
         * The hex-encoded key for verification in interactions and the GameSDK's GetTicket
         * @type {?string}
         */
        this.verifyKey = (_q = (_p = data.verify_key) !== null && _p !== void 0 ? _p : this.verifyKey) !== null && _q !== void 0 ? _q : null;
    }
}
module.exports = IntegrationApplication;
