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
const CachedManager = require('./CachedManager');
const MessageReaction = require('../structures/MessageReaction');
/**
 * Manages API methods for reactions and holds their cache.
 * @extends {CachedManager}
 */
class ReactionManager extends CachedManager {
    constructor(message, iterable) {
        super(message.client, MessageReaction, iterable);
        /**
         * The message that this manager belongs to
         * @type {Message}
         */
        this.message = message;
    }
    _add(data, cache) {
        var _a;
        return super._add(data, cache, { id: (_a = data.emoji.id) !== null && _a !== void 0 ? _a : data.emoji.name, extras: [this.message] });
    }
    /**
     * The reaction cache of this manager
     * @type {Collection<string|Snowflake, MessageReaction>}
     * @name ReactionManager#cache
     */
    /**
     * Data that can be resolved to a MessageReaction object. This can be:
     * * A MessageReaction
     * * A Snowflake
     * @typedef {MessageReaction|Snowflake} MessageReactionResolvable
     */
    /**
     * Resolves a {@link MessageReactionResolvable} to a {@link MessageReaction} object.
     * @method resolve
     * @memberof ReactionManager
     * @instance
     * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
     * @returns {?MessageReaction}
     */
    /**
     * Resolves a {@link MessageReactionResolvable} to a {@link MessageReaction} id.
     * @method resolveId
     * @memberof ReactionManager
     * @instance
     * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
     * @returns {?Snowflake}
     */
    /**
     * Removes all reactions from a message.
     * @returns {Promise<Message>}
     */
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.api.channels(this.message.channelId).messages(this.message.id).reactions.delete();
            return this.message;
        });
    }
}
module.exports = ReactionManager;
