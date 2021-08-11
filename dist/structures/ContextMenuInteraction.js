'use strict';
const BaseCommandInteraction = require('./BaseCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const { ApplicationCommandOptionTypes, ApplicationCommandTypes } = require('../util/Constants');
/**
 * Represents a context menu interaction.
 * @extends {BaseCommandInteraction}
 */
class ContextMenuInteraction extends BaseCommandInteraction {
    constructor(client, data) {
        super(client, data);
        /**
         * The target of the interaction, parsed into options
         * @type {CommandInteractionOptionResolver}
         */
        this.options = new CommandInteractionOptionResolver(this.client, this.resolveContextMenuOptions(data.data));
        /**
         * The id of the target of the interaction
         * @type {Snowflake}
         */
        this.targetId = data.data.target_id;
        /**
         * The type of the target of the interaction; either USER or MESSAGE
         * @type {ApplicationCommandType}
         */
        this.targetType = ApplicationCommandTypes[data.data.type];
    }
    /**
     * Resolves and transforms options received from the API for a context menu interaction.
     * @param {APIApplicationCommandInteractionData} data The interaction data
     * @returns {CommandInteractionOption[]}
     * @private
     */
    resolveContextMenuOptions({ target_id, resolved }) {
        var _a, _b, _c;
        const result = [];
        if ((_a = resolved.users) === null || _a === void 0 ? void 0 : _a[target_id]) {
            result.push(this.transformOption({ name: 'user', type: ApplicationCommandOptionTypes.USER, value: target_id }, resolved));
        }
        if ((_b = resolved.messages) === null || _b === void 0 ? void 0 : _b[target_id]) {
            result.push({
                name: 'message',
                type: '_MESSAGE',
                value: target_id,
                message: (_c = this.channel) === null || _c === void 0 ? void 0 : _c.messages._add(resolved.messages[target_id]),
            });
        }
        return result;
    }
}
module.exports = ContextMenuInteraction;
