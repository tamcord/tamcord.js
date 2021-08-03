// @ts-nocheck
'use strict';
const { Events } = require('../../../util/Constants');
module.exports = (client, { d: data }) => {
    var _a, _b, _c;
    const commandManager = data.guild_id ? (_a = client.guilds.cache.get(data.guild_id)) === null || _a === void 0 ? void 0 : _a.commands : client.application.commands;
    if (!commandManager)
        return;
    const oldCommand = (_c = (_b = commandManager.cache.get(data.id)) === null || _b === void 0 ? void 0 : _b._clone()) !== null && _c !== void 0 ? _c : null;
    const newCommand = commandManager._add(data, data.application_id === client.application.id);
    /**
     * Emitted when a guild application command is updated.
     * @event Client#applicationCommandUpdate
     * @param {?ApplicationCommand} oldCommand The command before the update
     * @param {ApplicationCommand} newCommand The command after the update
     */
    client.emit(Events.APPLICATION_COMMAND_UPDATE, oldCommand, newCommand);
};
