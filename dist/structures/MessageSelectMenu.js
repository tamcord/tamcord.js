// @ts-nocheck
'use strict';
const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');
const Util = require('../util/Util');
/**
 * Represents a select menu message component
 * @extends {BaseMessageComponent}
 */
class MessageSelectMenu extends BaseMessageComponent {
    /**
     * @typedef {BaseMessageComponentOptions} MessageSelectMenuOptions
     * @property {string} [customId] A unique string to be sent in the interaction when clicked
     * @property {string} [placeholder] Custom placeholder text to display when nothing is selected
     * @property {number} [minValues] The minimum number of selections required
     * @property {number} [maxValues] The maximum number of selections allowed
     * @property {MessageSelectOption[]} [options] Options for the select menu
     * @property {boolean} [disabled=false] Disables the select menu to prevent interactions
     */
    /**
     * @typedef {Object} MessageSelectOption
     * @property {string} label The text to be displayed on this option
     * @property {string} value The value to be sent for this option
     * @property {?string} description Optional description to show for this option
     * @property {?RawEmoji} emoji Emoji to display for this option
     * @property {boolean} default Render this option as the default selection
     */
    /**
     * @typedef {Object} MessageSelectOptionData
     * @property {string} label The text to be displayed on this option
     * @property {string} value The value to be sent for this option
     * @property {string} [description] Optional description to show for this option
     * @property {EmojiIdentifierResolvable} [emoji] Emoji to display for this option
     * @property {boolean} [default] Render this option as the default selection
     */
    /**
     * @param {MessageSelectMenu|MessageSelectMenuOptions} [data={}] MessageSelectMenu to clone or raw data
     */
    constructor(data = {}) {
        super({ type: 'SELECT_MENU' });
        this.setup(data);
    }
    setup(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        /**
         * A unique string to be sent in the interaction when clicked
         * @type {?string}
         */
        this.customId = (_b = (_a = data.custom_id) !== null && _a !== void 0 ? _a : data.customId) !== null && _b !== void 0 ? _b : null;
        /**
         * Custom placeholder text to display when nothing is selected
         * @type {?string}
         */
        this.placeholder = (_c = data.placeholder) !== null && _c !== void 0 ? _c : null;
        /**
         * The minimum number of selections required
         * @type {?number}
         */
        this.minValues = (_e = (_d = data.min_values) !== null && _d !== void 0 ? _d : data.minValues) !== null && _e !== void 0 ? _e : null;
        /**
         * The maximum number of selections allowed
         * @type {?number}
         */
        this.maxValues = (_g = (_f = data.max_values) !== null && _f !== void 0 ? _f : data.maxValues) !== null && _g !== void 0 ? _g : null;
        /**
         * Options for the select menu
         * @type {MessageSelectOption[]}
         */
        this.options = this.constructor.normalizeOptions((_h = data.options) !== null && _h !== void 0 ? _h : []);
        /**
         * Whether this select menu is currently disabled
         * @type {boolean}
         */
        this.disabled = (_j = data.disabled) !== null && _j !== void 0 ? _j : false;
    }
    /**
     * Sets the custom id of this select menu
     * @param {string} customId A unique string to be sent in the interaction when clicked
     * @returns {MessageSelectMenu}
     */
    setCustomId(customId) {
        this.customId = Util.verifyString(customId, RangeError, 'SELECT_MENU_CUSTOM_ID');
        return this;
    }
    /**
     * Sets the interactive status of the select menu
     * @param {boolean} [disabled=true] Whether this select menu should be disabled
     * @returns {MessageSelectMenu}
     */
    setDisabled(disabled = true) {
        this.disabled = disabled;
        return this;
    }
    /**
     * Sets the maximum number of selections allowed for this select menu
     * @param {number} maxValues Number of selections to be allowed
     * @returns {MessageSelectMenu}
     */
    setMaxValues(maxValues) {
        this.maxValues = maxValues;
        return this;
    }
    /**
     * Sets the minimum number of selections required for this select menu
     * <info>This will default the maxValues to the number of options, unless manually set</info>
     * @param {number} minValues Number of selections to be required
     * @returns {MessageSelectMenu}
     */
    setMinValues(minValues) {
        this.minValues = minValues;
        return this;
    }
    /**
     * Sets the placeholder of this select menu
     * @param {string} placeholder Custom placeholder text to display when nothing is selected
     * @returns {MessageSelectMenu}
     */
    setPlaceholder(placeholder) {
        this.placeholder = Util.verifyString(placeholder, RangeError, 'SELECT_MENU_PLACEHOLDER');
        return this;
    }
    /**
     * Adds options to the select menu.
     * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options The options to add
     * @returns {MessageSelectMenu}
     */
    addOptions(...options) {
        this.options.push(...this.constructor.normalizeOptions(options));
        return this;
    }
    /**
     * Removes, replaces, and inserts options in the select menu.
     * @param {number} index The index to start at
     * @param {number} deleteCount The number of options to remove
     * @param {...MessageSelectOptionData|MessageSelectOptionData[]} [options] The replacing option objects
     * @returns {MessageSelectMenu}
     */
    spliceOptions(index, deleteCount, ...options) {
        this.options.splice(index, deleteCount, ...this.constructor.normalizeOptions(...options));
        return this;
    }
    /**
     * Transforms this select menu to a plain object
     * @returns {Object} The raw data of this select menu
     */
    toJSON() {
        var _a;
        return {
            custom_id: this.customId,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: (_a = this.maxValues) !== null && _a !== void 0 ? _a : (this.minValues ? this.options.length : undefined),
            options: this.options,
            type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
        };
    }
    /**
     * Normalizes option input and resolves strings and emojis.
     * @param {MessageSelectOptionData} option The select menu option to normalize
     * @returns {MessageSelectOption}
     */
    static normalizeOption(option) {
        var _a;
        let { label, value, description, emoji } = option;
        label = Util.verifyString(label, RangeError, 'SELECT_OPTION_LABEL');
        value = Util.verifyString(value, RangeError, 'SELECT_OPTION_VALUE');
        emoji = emoji ? Util.resolvePartialEmoji(emoji) : null;
        description = description ? Util.verifyString(description, RangeError, 'SELECT_OPTION_DESCRIPTION', true) : null;
        return { label, value, description, emoji, default: (_a = option.default) !== null && _a !== void 0 ? _a : false };
    }
    /**
     * Normalizes option input and resolves strings and emojis.
     * @param {...MessageSelectOptionData|MessageSelectOptionData[]} options The select menu options to normalize
     * @returns {MessageSelectOption[]}
     */
    static normalizeOptions(...options) {
        return options.flat(Infinity).map(option => this.normalizeOption(option));
    }
}
module.exports = MessageSelectMenu;
