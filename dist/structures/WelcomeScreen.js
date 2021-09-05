// @ts-nocheck
'use strict';
const Collection = require('../util/Collection');
const Base = require('./Base');
const WelcomeChannel = require('./WelcomeChannel');
/**
 * Represents a welcome screen.
 * @extends {Base}
 */
class WelcomeScreen extends Base {
    constructor(guild, data) {
        var _a;
        super(guild.client);
        /**
         * The guild for this welcome screen
         * @type {Guild}
         */
        this.guild = guild;
        /**
         * The description of this welcome screen
         * @type {?string}
         */
        this.description = (_a = data.description) !== null && _a !== void 0 ? _a : null;
        /**
         * Collection of welcome channels belonging to this welcome screen
         * @type {Collection<Snowflake, WelcomeChannel>}
         */
        this.welcomeChannels = new Collection();
        for (const channel of data.welcome_channels) {
            const welcomeChannel = new WelcomeChannel(this.guild, channel);
            this.welcomeChannels.set(welcomeChannel.channelId, welcomeChannel);
        }
    }
    /**
     * Whether the welcome screen is enabled on the guild or not
     * @type {boolean}
     */
    get enabled() {
        return this.guild.features.includes('WELCOME_SCREEN_ENABLED');
    }
}
module.exports = WelcomeScreen;
