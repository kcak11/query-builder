import 'jquery';
import 'jquery-extendext';

/**
 * @typedef {object} Filter
 * @memberof QueryBuilder
 * @description See {@link http://querybuilder.js.org/index.html#filters}
 */

/**
 * @typedef {object} Operator
 * @memberof QueryBuilder
 * @description See {@link http://querybuilder.js.org/index.html#operators}
 */

import {QueryBuilder} from './core';

import './events';
import {QueryBuilderSelectors, QueryBuilderOperators, QueryBuilderDefaults} from './defaults';
import './plugins';
import './public';
import './data';
import './template';
import {Group, Rule} from './model';
import * as Utils from './utils';
import './jquery';
import en from './i18n/en';

QueryBuilder.addLocale(en, true);

/**
 * CSS selectors for common components
 * @type {object.<string, string>}
 * @readonly
 */
QueryBuilder.SELECTORS = QueryBuilderSelectors;

/**
 * Default configuration
 * @type {object}
 * @readonly
 */
QueryBuilder.DEFAULTS = QueryBuilderDefaults;

/**
 * Default operators
 * @type {object.<string, object>}
 * @readonly
 */
QueryBuilder.OPERATORS = QueryBuilderOperators;

/**
 * @member {object}
 * @memberof QueryBuilder
 * @see Utils
 */
QueryBuilder.utils = Utils;

/**
 * @member {function}
 * @memberof QueryBuilder
 * @see Group
 */
QueryBuilder.Group = Group;

/**
 * @member {function}
 * @memberof QueryBuilder
 * @see Rule
 */
QueryBuilder.Rule = Rule;

export default QueryBuilder;
