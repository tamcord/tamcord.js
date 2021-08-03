'use strict';
const { Events } = require('../../../util/Constants');
module.exports = (client, { d: data }) => {
    var _a, _b, _c, _d;
    let oldCommand;
    let newCommand;
    if (data.guild_id) {
        const guild = client.guilds.cache.get(data.guild_id);
        if (!guild)
            return;
        oldCommand = (_b = (_a = guild.commands.cache.get(data.id)) === null || _a === void 0 ? void 0 : _a._clone()) !== null && _b !== void 0 ? _b : null;
        newCommand = guild.commands.add(data);
    }
    else {
        oldCommand = (_d = (_c = client.application.commands.cache.get(data.id)) === null || _c === void 0 ? void 0 : _c._clone()) !== null && _d !== void 0 ? _d : null;
        newCommand = client.application.commands.add(data);
    }
    /**
     * Emitted when an application command is updated.
     * @event Client#applicationCommandUpdate
     * @param {?ApplicationCommand} oldCommand The command before the update
     * @param {ApplicationCommand} newCommand The command after the update
     */
    client.emit(Events.APPLICATION_COMMAND_UPDATE, oldCommand, newCommand);
};
