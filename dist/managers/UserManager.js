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
const GuildMember = require('../structures/GuildMember');
const Message = require('../structures/Message');
const ThreadMember = require('../structures/ThreadMember');
const User = require('../structures/User');
/**
 * Manages API methods for users and stores their cache.
 * @extends {CachedManager}
 */
class UserManager extends CachedManager {
    constructor(client, iterable) {
        super(client, User, iterable);
    }
    /**
     * The cache of this manager
     * @type {Collection<Snowflake, User>}
     * @name UserManager#cache
     */
    /**
     * Data that resolves to give a User object. This can be:
     * * A User object
     * * A Snowflake
     * * A Message object (resolves to the message author)
     * * A GuildMember object
     * * A ThreadMember object
     * @typedef {User|Snowflake|Message|GuildMember|ThreadMember} UserResolvable
     */
    /**
     * Resolves a {@link UserResolvable} to a {@link User} object.
     * @param {UserResolvable} user The UserResolvable to identify
     * @returns {?User}
     */
    resolve(user) {
        if (user instanceof GuildMember || user instanceof ThreadMember)
            return user.user;
        if (user instanceof Message)
            return user.author;
        return super.resolve(user);
    }
    /**
     * Resolves a {@link UserResolvable} to a {@link User} id.
     * @param {UserResolvable} user The UserResolvable to identify
     * @returns {?Snowflake}
     */
    resolveId(user) {
        if (user instanceof ThreadMember)
            return user.id;
        if (user instanceof GuildMember)
            return user.user.id;
        if (user instanceof Message)
            return user.author.id;
        return super.resolveId(user);
    }
    /**
     * Obtains a user from Discord, or the user cache if it's already available.
     * @param {Snowflake} id The user's id
     * @param {BaseFetchOptions} [options] Additional options for this fetch
     * @returns {Promise<User>}
     */
    fetch(id, { cache = true, force = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                const existing = this.cache.get(id);
                if (existing && !existing.partial)
                    return existing;
            }
            const data = yield this.client.api.users(id).get();
            return this._add(data, cache);
        });
    }
}
module.exports = UserManager;
