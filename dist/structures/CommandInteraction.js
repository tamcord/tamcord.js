// @ts-nocheck
'use strict';
const BaseCommandInteraction = require('./BaseCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
/**
 * Represents a command interaction.
 * @extends {BaseCommandInteraction}
 */
class CommandInteraction extends BaseCommandInteraction {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        /**
         * The options passed to the command.
         * @type {CommandInteractionOptionResolver}
         */
        this.options = new CommandInteractionOptionResolver(this.client, (_b = (_a = data.data.options) === null || _a === void 0 ? void 0 : _a.map(option => this.transformOption(option, data.data.resolved))) !== null && _b !== void 0 ? _b : []);
    }
}
module.exports = CommandInteraction;
