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
const { Error } = require('../../errors');
const { InteractionResponseTypes } = require('../../util/Constants');
const MessageFlags = require('../../util/MessageFlags');
const MessagePayload = require('../MessagePayload');
/**
 * Interface for classes that support shared interaction response types.
 * @interface
 */
class InteractionResponses {
    /**
     * Options for deferring the reply to an {@link Interaction}.
     * @typedef {Object} InteractionDeferReplyOptions
     * @property {boolean} [ephemeral] Whether the reply should be ephemeral
     * @property {boolean} [fetchReply] Whether to fetch the reply
     */
    /**
     * Options for deferring and updating the reply to a {@link ButtonInteraction}.
     * @typedef {Object} InteractionDeferUpdateOptions
     * @property {boolean} [fetchReply] Whether to fetch the reply
     */
    /**
     * Options for a reply to an {@link Interaction}.
     * @typedef {BaseMessageOptions} InteractionReplyOptions
     * @property {boolean} [ephemeral] Whether the reply should be ephemeral
     * @property {boolean} [fetchReply] Whether to fetch the reply
     */
    /**
     * Options for updating the message received from a {@link ButtonInteraction}.
     * @typedef {MessageEditOptions} InteractionUpdateOptions
     * @property {boolean} [fetchReply] Whether to fetch the reply
     */
    /**
     * Defers the reply to this interaction.
     * @param {InteractionDeferReplyOptions} [options] Options for deferring the reply to this interaction
     * @returns {Promise<Message|APIMessage|void>}
     * @example
     * // Defer the reply to this interaction
     * interaction.deferReply()
     *   .then(console.log)
     *   .catch(console.error)
     * @example
     * // Defer to send an ephemeral reply later
     * interaction.deferReply({ ephemeral: true })
     *   .then(console.log)
     *   .catch(console.error);
     */
    deferReply(options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            if (options.fetchReply && options.ephemeral)
                throw new Error('INTERACTION_FETCH_EPHEMERAL');
            this.ephemeral = (_a = options.ephemeral) !== null && _a !== void 0 ? _a : false;
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: options.ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
                    },
                },
            });
            this.deferred = true;
            return options.fetchReply ? this.fetchReply() : undefined;
        });
    }
    /**
     * Creates a reply to this interaction.
     * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
     * @returns {Promise<Message|APIMessage|void>}
     * @example
     * // Reply to the interaction with an embed
     * const embed = new MessageEmbed().setDescription('Pong!');
     *
     * interaction.reply({ embeds: [embed] })
     *   .then(() => console.log('Reply sent.'))
     *   .catch(console.error);
     * @example
     * // Create an ephemeral reply
     * interaction.reply({ content: 'Pong!', ephemeral: true })
     *   .then(() => console.log('Reply sent.'))
     *   .catch(console.error);
     */
    reply(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            if (options.fetchReply && options.ephemeral)
                throw new Error('INTERACTION_FETCH_EPHEMERAL');
            this.ephemeral = (_a = options.ephemeral) !== null && _a !== void 0 ? _a : false;
            let messagePayload;
            if (options instanceof MessagePayload)
                messagePayload = options;
            else
                messagePayload = MessagePayload.create(this, options);
            const { data, files } = yield messagePayload.resolveData().resolveFiles();
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                    data,
                },
                files,
            });
            this.replied = true;
            return options.fetchReply ? this.fetchReply() : undefined;
        });
    }
    /**
     * Fetches the initial reply to this interaction.
     * @see Webhook#fetchMessage
     * @returns {Promise<Message|APIMessage>}
     * @example
     * // Fetch the reply to this interaction
     * interaction.fetchReply()
     *   .then(reply => console.log(`Replied with ${reply.content}`))
     *   .catch(console.error);
     */
    fetchReply() {
        if (this.ephemeral)
            throw new Error('INTERACTION_EPHEMERAL_REPLIED');
        return this.webhook.fetchMessage('@original');
    }
    /**
     * Edits the initial reply to this interaction.
     * @see Webhook#editMessage
     * @param {string|MessagePayload|WebhookEditMessageOptions} options The new options for the message
     * @returns {Promise<Message|APIMessage>}
     * @example
     * // Edit the reply to this interaction
     * interaction.editReply('New content')
     *   .then(console.log)
     *   .catch(console.error);
     */
    editReply(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deferred && !this.replied)
                throw new Error('INTERACTION_NOT_REPLIED');
            const message = yield this.webhook.editMessage('@original', options);
            this.replied = true;
            return message;
        });
    }
    /**
     * Deletes the initial reply to this interaction.
     * @see Webhook#deleteMessage
     * @returns {Promise<void>}
     * @example
     * // Delete the reply to this interaction
     * interaction.deleteReply()
     *   .then(console.log)
     *   .catch(console.error);
     */
    deleteReply() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ephemeral)
                throw new Error('INTERACTION_EPHEMERAL_REPLIED');
            yield this.webhook.deleteMessage('@original');
        });
    }
    /**
     * Send a follow-up message to this interaction.
     * @param {string|MessagePayload|InteractionReplyOptions} options The options for the reply
     * @returns {Promise<Message|APIMessage>}
     */
    followUp(options) {
        return this.webhook.send(options);
    }
    /**
     * Defers an update to the message to which the component was attached.
     * @param {InteractionDeferUpdateOptions} [options] Options for deferring the update to this interaction
     * @returns {Promise<Message|APIMessage|void>}
     * @example
     * // Defer updating and reset the component's loading state
     * interaction.deferUpdate()
     *   .then(console.log)
     *   .catch(console.error);
     */
    deferUpdate(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            if (options.fetchReply && new MessageFlags(this.message.flags).has(MessageFlags.FLAGS.EPHEMERAL)) {
                throw new Error('INTERACTION_FETCH_EPHEMERAL');
            }
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
                },
            });
            this.deferred = true;
            return options.fetchReply ? this.fetchReply() : undefined;
        });
    }
    /**
     * Updates the original message of the component on which the interaction was received on.
     * @param {string|MessagePayload|InteractionUpdateOptions} options The options for the updated message
     * @returns {Promise<Message|APIMessage|void>}
     * @example
     * // Remove the components from the message
     * interaction.update({
     *   content: "A component interaction was received",
     *   components: []
     * })
     *   .then(console.log)
     *   .catch(console.error);
     */
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            if (options.fetchReply && new MessageFlags(this.message.flags).has(MessageFlags.FLAGS.EPHEMERAL)) {
                throw new Error('INTERACTION_FETCH_EPHEMERAL');
            }
            let messagePayload;
            if (options instanceof MessagePayload)
                messagePayload = options;
            else
                messagePayload = MessagePayload.create(this, options);
            const { data, files } = yield messagePayload.resolveData().resolveFiles();
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.UPDATE_MESSAGE,
                    data,
                },
                files,
            });
            this.replied = true;
            return options.fetchReply ? this.fetchReply() : undefined;
        });
    }
    static applyToClass(structure, ignore = []) {
        const props = [
            'deferReply',
            'reply',
            'fetchReply',
            'editReply',
            'deleteReply',
            'followUp',
            'deferUpdate',
            'update',
        ];
        for (const prop of props) {
            if (ignore.includes(prop))
                continue;
            Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(InteractionResponses.prototype, prop));
        }
    }
}
module.exports = InteractionResponses;
