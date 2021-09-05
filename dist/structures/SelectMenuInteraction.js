// @ts-nocheck
'use strict';
const MessageComponentInteraction = require('./MessageComponentInteraction');
/**
 * Represents a select menu interaction.
 * @extends {MessageComponentInteraction}
 */
class SelectMenuInteraction extends MessageComponentInteraction {
    constructor(client, data) {
        var _a;
        super(client, data);
        /**
         * The values selected, if the component which was interacted with was a select menu
         * @type {string[]}
         */
        this.values = (_a = data.data.values) !== null && _a !== void 0 ? _a : [];
    }
}
module.exports = SelectMenuInteraction;
