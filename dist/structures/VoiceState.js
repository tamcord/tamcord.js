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
const { Error, TypeError } = require('../errors');
/**
 * Represents the voice state for a Guild Member.
 */
class VoiceState extends Base {
    /**
     * @param {Guild} guild The guild the voice state is part of
     * @param {APIVoiceState} data The data for the voice state
     */
    constructor(guild, data) {
        super(guild.client);
        /**
         * The guild of this voice state
         * @type {Guild}
         */
        this.guild = guild;
        /**
         * The id of the member of this voice state
         * @type {Snowflake}
         */
        this.id = data.user_id;
        this._patch(data);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /**
         * Whether this member is deafened server-wide
         * @type {?boolean}
         */
        this.serverDeaf = (_a = data.deaf) !== null && _a !== void 0 ? _a : null;
        /**
         * Whether this member is muted server-wide
         * @type {?boolean}
         */
        this.serverMute = (_b = data.mute) !== null && _b !== void 0 ? _b : null;
        /**
         * Whether this member is self-deafened
         * @type {?boolean}
         */
        this.selfDeaf = (_c = data.self_deaf) !== null && _c !== void 0 ? _c : null;
        /**
         * Whether this member is self-muted
         * @type {?boolean}
         */
        this.selfMute = (_d = data.self_mute) !== null && _d !== void 0 ? _d : null;
        /**
         * Whether this member's camera is enabled
         * @type {?boolean}
         */
        this.selfVideo = (_e = data.self_video) !== null && _e !== void 0 ? _e : null;
        /**
         * The session id for this member's connection
         * @type {?string}
         */
        this.sessionId = (_f = data.session_id) !== null && _f !== void 0 ? _f : null;
        /**
         * Whether this member is streaming using "Screen Share"
         * @type {boolean}
         */
        this.streaming = (_g = data.self_stream) !== null && _g !== void 0 ? _g : false;
        /**
         * The {@link VoiceChannel} or {@link StageChannel} id the member is in
         * @type {?Snowflake}
         */
        this.channelId = (_h = data.channel_id) !== null && _h !== void 0 ? _h : null;
        /**
         * Whether this member is suppressed from speaking. This property is specific to stage channels only.
         * @type {boolean}
         */
        this.suppress = data.suppress;
        /**
         * The time at which the member requested to speak. This property is specific to stage channels only.
         * @type {?number}
         */
        this.requestToSpeakTimestamp = data.request_to_speak_timestamp
            ? new Date(data.request_to_speak_timestamp).getTime()
            : null;
        return this;
    }
    /**
     * The member that this voice state belongs to
     * @type {?GuildMember}
     * @readonly
     */
    get member() {
        var _a;
        return (_a = this.guild.members.cache.get(this.id)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The channel that the member is connected to
     * @type {?(VoiceChannel|StageChannel)}
     * @readonly
     */
    get channel() {
        var _a;
        return (_a = this.guild.channels.cache.get(this.channelId)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Whether this member is either self-deafened or server-deafened
     * @type {?boolean}
     * @readonly
     */
    get deaf() {
        return this.serverDeaf || this.selfDeaf;
    }
    /**
     * Whether this member is either self-muted or server-muted
     * @type {?boolean}
     * @readonly
     */
    get mute() {
        return this.serverMute || this.selfMute;
    }
    /**
     * Mutes/unmutes the member of this voice state.
     * @param {boolean} mute Whether or not the member should be muted
     * @param {string} [reason] Reason for muting or unmuting
     * @returns {Promise<GuildMember>}
     */
    setMute(mute, reason) {
        var _a, _b;
        return (_b = (_a = this.member) === null || _a === void 0 ? void 0 : _a.edit({ mute }, reason)) !== null && _b !== void 0 ? _b : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
    }
    /**
     * Deafens/undeafens the member of this voice state.
     * @param {boolean} deaf Whether or not the member should be deafened
     * @param {string} [reason] Reason for deafening or undeafening
     * @returns {Promise<GuildMember>}
     */
    setDeaf(deaf, reason) {
        var _a, _b;
        return (_b = (_a = this.member) === null || _a === void 0 ? void 0 : _a.edit({ deaf }, reason)) !== null && _b !== void 0 ? _b : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
    }
    /**
     * Disconnects the member from the channel.
     * @param {string} [reason] Reason for disconnecting the member from the channel
     * @returns {Promise<GuildMember>}
     */
    disconnect(reason) {
        return this.setChannel(null, reason);
    }
    /**
     * Moves the member to a different channel, or disconnects them from the one they're in.
     * @param {VoiceChannelResolvable|null} channel Channel to move the member to, or `null` if you want to disconnect
     * them from voice.
     * @param {string} [reason] Reason for moving member to another channel or disconnecting
     * @returns {Promise<GuildMember>}
     */
    setChannel(channel, reason) {
        var _a, _b;
        return (_b = (_a = this.member) === null || _a === void 0 ? void 0 : _a.edit({ channel }, reason)) !== null && _b !== void 0 ? _b : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
    }
    /**
     * Toggles the request to speak in the channel.
     * Only applicable for stage channels and for the client's own voice state.
     * @param {boolean} request Whether or not the client is requesting to become a speaker.
     * @example
     * // Making the client request to speak in a stage channel (raise its hand)
     * guild.me.voice.setRequestToSpeak(true);
     * @example
     * // Making the client cancel a request to speak
     * guild.me.voice.setRequestToSpeak(false);
     * @returns {Promise<void>}
     */
    setRequestToSpeak(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = this.channel) === null || _a === void 0 ? void 0 : _a.type) !== 'GUILD_STAGE_VOICE')
                throw new Error('VOICE_NOT_STAGE_CHANNEL');
            if (this.client.user.id !== this.id)
                throw new Error('VOICE_STATE_NOT_OWN');
            yield this.client.api.guilds(this.guild.id, 'voice-states', '@me').patch({
                data: {
                    channel_id: this.channelId,
                    request_to_speak_timestamp: request ? new Date().toISOString() : null,
                },
            });
        });
    }
    /**
     * Suppress/unsuppress the user. Only applicable for stage channels.
     * @param {boolean} suppressed - Whether or not the user should be suppressed.
     * @example
     * // Making the client a speaker
     * guild.me.voice.setSuppressed(false);
     * @example
     * // Making the client an audience member
     * guild.me.voice.setSuppressed(true);
     * @example
     * // Inviting another user to speak
     * voiceState.setSuppressed(false);
     * @example
     * // Moving another user to the audience, or cancelling their invite to speak
     * voiceState.setSuppressed(true);
     * @returns {Promise<void>}
     */
    setSuppressed(suppressed) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof suppressed !== 'boolean')
                throw new TypeError('VOICE_STATE_INVALID_TYPE', 'suppressed');
            if (((_a = this.channel) === null || _a === void 0 ? void 0 : _a.type) !== 'GUILD_STAGE_VOICE')
                throw new Error('VOICE_NOT_STAGE_CHANNEL');
            const target = this.client.user.id === this.id ? '@me' : this.id;
            yield this.client.api.guilds(this.guild.id, 'voice-states', target).patch({
                data: {
                    channel_id: this.channelId,
                    suppress: suppressed,
                },
            });
        });
    }
    toJSON() {
        return super.toJSON({
            id: true,
            serverDeaf: true,
            serverMute: true,
            selfDeaf: true,
            selfMute: true,
            sessionId: true,
            channelId: 'channel',
        });
    }
}
module.exports = VoiceState;
