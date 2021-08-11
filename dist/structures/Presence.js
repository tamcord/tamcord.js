// @ts-nocheck
'use strict';
const Base = require('./Base');
const Emoji = require('./Emoji');
const ActivityFlags = require('../util/ActivityFlags');
const { ActivityTypes } = require('../util/Constants');
const Util = require('../util/Util');
/**
 * Activity sent in a message.
 * @typedef {Object} MessageActivity
 * @property {string} [partyId] Id of the party represented in activity
 * @property {number} [type] Type of activity sent
 */
/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`offline`** - user is offline or invisible
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} PresenceStatus
 */
/**
 * The status of this presence:
 * * **`online`** - user is online
 * * **`idle`** - user is AFK
 * * **`dnd`** - user is in Do Not Disturb
 * @typedef {string} ClientPresenceStatus
 */
/**
 * Represents a user's presence.
 * @extends {Base}
 */
class Presence extends Base {
    /**
     * @param {Client} client The instantiating client
     * @param {APIPresence} [data={}] The data for the presence
     */
    constructor(client, data = {}) {
        var _a;
        super(client);
        /**
         * The presence's user id
         * @type {Snowflake}
         */
        this.userId = data.user.id;
        /**
         * The guild this presence is in
         * @type {?Guild}
         */
        this.guild = (_a = data.guild) !== null && _a !== void 0 ? _a : null;
        this._patch(data);
    }
    /**
     * The user of this presence
     * @type {?User}
     * @readonly
     */
    get user() {
        return this.client.users.resolve(this.userId);
    }
    /**
     * The member of this presence
     * @type {?GuildMember}
     * @readonly
     */
    get member() {
        return this.guild.members.resolve(this.userId);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e;
        /**
         * The status of this presence
         * @type {PresenceStatus}
         */
        this.status = (_b = (_a = data.status) !== null && _a !== void 0 ? _a : this.status) !== null && _b !== void 0 ? _b : 'offline';
        /**
         * The activities of this presence
         * @type {Activity[]}
         */
        this.activities = (_d = (_c = data.activities) === null || _c === void 0 ? void 0 : _c.map(activity => new Activity(this, activity))) !== null && _d !== void 0 ? _d : [];
        /**
         * The devices this presence is on
         * @type {?Object}
         * @property {?ClientPresenceStatus} web The current presence in the web application
         * @property {?ClientPresenceStatus} mobile The current presence in the mobile application
         * @property {?ClientPresenceStatus} desktop The current presence in the desktop application
         */
        this.clientStatus = (_e = data.client_status) !== null && _e !== void 0 ? _e : null;
        return this;
    }
    _clone() {
        const clone = Object.assign(Object.create(this), this);
        clone.activities = this.activities.map(activity => activity._clone());
        return clone;
    }
    /**
     * Whether this presence is equal to another.
     * @param {Presence} presence The presence to compare with
     * @returns {boolean}
     */
    equals(presence) {
        var _a, _b, _c, _d, _e, _f;
        return (this === presence ||
            (presence &&
                this.status === presence.status &&
                this.activities.length === presence.activities.length &&
                this.activities.every((activity, index) => activity.equals(presence.activities[index])) &&
                ((_a = this.clientStatus) === null || _a === void 0 ? void 0 : _a.web) === ((_b = presence.clientStatus) === null || _b === void 0 ? void 0 : _b.web) &&
                ((_c = this.clientStatus) === null || _c === void 0 ? void 0 : _c.mobile) === ((_d = presence.clientStatus) === null || _d === void 0 ? void 0 : _d.mobile) &&
                ((_e = this.clientStatus) === null || _e === void 0 ? void 0 : _e.desktop) === ((_f = presence.clientStatus) === null || _f === void 0 ? void 0 : _f.desktop)));
    }
    toJSON() {
        return Util.flatten(this);
    }
}
/**
 * The platform of this activity:
 * * **`desktop`**
 * * **`samsung`** - playing on Samsung Galaxy
 * * **`xbox`** - playing on Xbox Live
 * @typedef {string} ActivityPlatform
 */
/**
 * Represents an activity that is part of a user's presence.
 */
class Activity {
    constructor(presence, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        Object.defineProperty(this, 'presence', { value: presence });
        /**
         * The activity's id
         * @type {string}
         */
        this.id = data.id;
        /**
         * The activity's name
         * @type {string}
         */
        this.name = data.name;
        /**
         * The activity status's type
         * @type {ActivityType}
         */
        this.type = typeof data.type === 'number' ? ActivityTypes[data.type] : data.type;
        /**
         * If the activity is being streamed, a link to the stream
         * @type {?string}
         */
        this.url = (_a = data.url) !== null && _a !== void 0 ? _a : null;
        /**
         * Details about the activity
         * @type {?string}
         */
        this.details = (_b = data.details) !== null && _b !== void 0 ? _b : null;
        /**
         * State of the activity
         * @type {?string}
         */
        this.state = (_c = data.state) !== null && _c !== void 0 ? _c : null;
        /**
         * The id of the application associated with this activity
         * @type {?Snowflake}
         */
        this.applicationId = (_d = data.application_id) !== null && _d !== void 0 ? _d : null;
        /**
         * Represents timestamps of an activity
         * @typedef {Object} ActivityTimestamps
         * @property {?Date} start When the activity started
         * @property {?Date} end When the activity will end
         */
        /**
         * Timestamps for the activity
         * @type {?ActivityTimestamps}
         */
        this.timestamps = data.timestamps
            ? {
                start: data.timestamps.start ? new Date(Number(data.timestamps.start)) : null,
                end: data.timestamps.end ? new Date(Number(data.timestamps.end)) : null,
            }
            : null;
        /**
         * The Spotify song's id
         * @type {?string}
         */
        this.syncId = (_e = data.sync_id) !== null && _e !== void 0 ? _e : null;
        /**
         * The platform the game is being played on
         * @type {?ActivityPlatform}
         */
        this.platform = (_f = data.platform) !== null && _f !== void 0 ? _f : null;
        /**
         * Represents a party of an activity
         * @typedef {Object} ActivityParty
         * @property {?string} id The party's id
         * @property {number[]} size Size of the party as `[current, max]`
         */
        /**
         * Party of the activity
         * @type {?ActivityParty}
         */
        this.party = (_g = data.party) !== null && _g !== void 0 ? _g : null;
        /**
         * Assets for rich presence
         * @type {?RichPresenceAssets}
         */
        this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;
        /**
         * Flags that describe the activity
         * @type {Readonly<ActivityFlags>}
         */
        this.flags = new ActivityFlags(data.flags).freeze();
        /**
         * Emoji for a custom activity
         * @type {?Emoji}
         */
        this.emoji = data.emoji ? new Emoji(presence.client, data.emoji) : null;
        /**
         * The game's or Spotify session's id
         * @type {?string}
         */
        this.sessionId = (_h = data.session_id) !== null && _h !== void 0 ? _h : null;
        /**
         * The labels of the buttons of this rich presence
         * @type {string[]}
         */
        this.buttons = (_j = data.buttons) !== null && _j !== void 0 ? _j : [];
        /**
         * Creation date of the activity
         * @type {number}
         */
        this.createdTimestamp = new Date(data.created_at).getTime();
    }
    /**
     * Whether this activity is equal to another activity.
     * @param {Activity} activity The activity to compare with
     * @returns {boolean}
     */
    equals(activity) {
        return (this === activity ||
            (activity &&
                this.name === activity.name &&
                this.type === activity.type &&
                this.url === activity.url &&
                this.state === activity.state &&
                this.details === activity.details));
    }
    /**
     * The time the activity was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * When concatenated with a string, this automatically returns the activities' name instead of the Activity object.
     * @returns {string}
     */
    toString() {
        return this.name;
    }
    _clone() {
        return Object.assign(Object.create(this), this);
    }
}
/**
 * Assets for a rich presence
 */
class RichPresenceAssets {
    constructor(activity, assets) {
        var _a, _b, _c, _d;
        Object.defineProperty(this, 'activity', { value: activity });
        /**
         * Hover text for the large image
         * @type {?string}
         */
        this.largeText = (_a = assets.large_text) !== null && _a !== void 0 ? _a : null;
        /**
         * Hover text for the small image
         * @type {?string}
         */
        this.smallText = (_b = assets.small_text) !== null && _b !== void 0 ? _b : null;
        /**
         * The large image asset's id
         * @type {?Snowflake}
         */
        this.largeImage = (_c = assets.large_image) !== null && _c !== void 0 ? _c : null;
        /**
         * The small image asset's id
         * @type {?Snowflake}
         */
        this.smallImage = (_d = assets.small_image) !== null && _d !== void 0 ? _d : null;
    }
    /**
     * Gets the URL of the small image asset
     * @param {StaticImageURLOptions} [options] Options for the image url
     * @returns {?string}
     */
    smallImageURL({ format, size } = {}) {
        return (this.smallImage &&
            this.activity.presence.client.rest.cdn.AppAsset(this.activity.applicationId, this.smallImage, {
                format,
                size,
            }));
    }
    /**
     * Gets the URL of the large image asset
     * @param {StaticImageURLOptions} [options] Options for the image url
     * @returns {?string}
     */
    largeImageURL({ format, size } = {}) {
        if (!this.largeImage)
            return null;
        if (/^spotify:/.test(this.largeImage)) {
            return `https://i.scdn.co/image/${this.largeImage.slice(8)}`;
        }
        else if (/^twitch:/.test(this.largeImage)) {
            return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${this.largeImage.slice(7)}.png`;
        }
        return this.activity.presence.client.rest.cdn.AppAsset(this.activity.applicationId, this.largeImage, {
            format,
            size,
        });
    }
}
exports.Presence = Presence;
exports.Activity = Activity;
exports.RichPresenceAssets = RichPresenceAssets;
