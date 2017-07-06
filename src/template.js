import * as $ from 'jquery';

import {QueryBuilder} from './core';
import {iterateOptions} from './utils';

import group from './templates/group.html';
import rule from './templates/rule.html';
import filterSelect from './templates/filterSelect.html';
import operatorSelect from './templates/operatorSelect.html';

/**
 * Template strings (see template.js)
 * @type {object.<string, string>}
 * @readonly
 */
QueryBuilder.templates = {group, rule, filterSelect, operatorSelect};

/**
 * Returns group's HTML
 * @param {string} group_id
 * @param {int} level
 * @returns {string}
 * @fires QueryBuilder.changer:getGroupTemplate
 * @private
 */
QueryBuilder.prototype.getGroupTemplate = function (group_id, level) {
    var h = this.templates.group({
        builder   : this,
        group_id  : group_id,
        level     : level,
        conditions: this.settings.conditions,
        icons     : this.icons,
        settings  : this.settings,
        translate : this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of a group
     * @event changer:getGroupTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @param {int} level
     * @returns {string}
     */
    return this.change('getGroupTemplate', h, level);
};

/**
 * Returns rule's HTML
 * @param {string} rule_id
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleTemplate
 * @private
 */
QueryBuilder.prototype.getRuleTemplate = function (rule_id) {
    var h = this.templates.rule({
        builder  : this,
        rule_id  : rule_id,
        icons    : this.icons,
        settings : this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of a rule
     * @event changer:getRuleTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @returns {string}
     */
    return this.change('getRuleTemplate', h);
};

/**
 * Returns rule's filter HTML
 * @param {Rule} rule
 * @param {object[]} filters
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleFilterTemplate
 * @private
 */
QueryBuilder.prototype.getRuleFilterSelect = function (rule, filters) {
    var h = this.templates.filterSelect({
        builder  : this,
        rule     : rule,
        filters  : filters,
        icons    : this.icons,
        settings : this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of the rule's filter dropdown
     * @event changer:getRuleFilterTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {QueryBuilder.Filter[]} filters
     * @returns {string}
     */
    return this.change('getRuleFilterSelect', h, rule, filters);
};

/**
 * Returns rule's operator HTML
 * @param {Rule} rule
 * @param {object[]} operators
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleOperatorTemplate
 * @private
 */
QueryBuilder.prototype.getRuleOperatorSelect = function (rule, operators) {
    var h = this.templates.operatorSelect({
        builder  : this,
        rule     : rule,
        operators: operators,
        icons    : this.icons,
        settings : this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of the rule's operator dropdown
     * @event changer:getRuleOperatorTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {QueryBuilder.Operator[]} operators
     * @returns {string}
     */
    return this.change('getRuleOperatorSelect', h, rule, operators);
};

/**
 * Returns the rule's value HTML
 * @param {Rule} rule
 * @param {int} value_id
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleInput
 * @private
 */
QueryBuilder.prototype.getRuleInput = function (rule, value_id) {
    var filter = rule.filter;
    var validation = rule.filter.validation || {};
    var name = rule.id + '_value_' + value_id;
    var c = filter.vertical ? ' class=block' : '';
    var h = '';

    if (typeof filter.input == 'function') {
        h = filter.input.call(this, rule, name);
    }
    else {
        switch (filter.input) {
            case 'radio':
            case 'checkbox':
                iterateOptions(filter.values, function (key, val) {
                    h += '<label' + c + '><input type="' + filter.input + '" name="' + name + '" value="' + key + '"> ' + val + '</label> ';
                });
                break;

            case 'select':
                h += '<select class="form-control" name="' + name + '"' + (filter.multiple ? ' multiple' : '') + '>';
                if (filter.placeholder) {
                    h += '<option value="' + filter.placeholder_value + '" disabled selected>' + filter.placeholder + '</option>';
                }
                iterateOptions(filter.values, function (key, val) {
                    h += '<option value="' + key + '">' + val + '</option> ';
                });
                h += '</select>';
                break;

            case 'textarea':
                h += '<textarea class="form-control" name="' + name + '"';
                if (filter.size) h += ' cols="' + filter.size + '"';
                if (filter.rows) h += ' rows="' + filter.rows + '"';
                if (validation.min !== undefined) h += ' minlength="' + validation.min + '"';
                if (validation.max !== undefined) h += ' maxlength="' + validation.max + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                h += '></textarea>';
                break;

            case 'number':
                h += '<input class="form-control" type="number" name="' + name + '"';
                if (validation.step !== undefined) h += ' step="' + validation.step + '"';
                if (validation.min !== undefined) h += ' min="' + validation.min + '"';
                if (validation.max !== undefined) h += ' max="' + validation.max + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                if (filter.size) h += ' size="' + filter.size + '"';
                h += '>';
                break;

            default:
                h += '<input class="form-control" type="text" name="' + name + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                if (filter.type === 'string' && validation.min !== undefined) h += ' minlength="' + validation.min + '"';
                if (filter.type === 'string' && validation.max !== undefined) h += ' maxlength="' + validation.max + '"';
                if (filter.size) h += ' size="' + filter.size + '"';
                h += '>';
        }
    }

    /**
     * Modifies the raw HTML of the rule's input
     * @event changer:getRuleInput
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {string} name - the name that the input must have
     * @returns {string}
     */
    return this.change('getRuleInput', h, rule, name);
};
