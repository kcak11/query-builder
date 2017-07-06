import * as $ from 'jquery';

import {QueryBuilder} from './core';
import {error} from './utils';
import {QueryBuilderDefaults} from './defaults';

/**
 * @module plugins
 */

/**
 * Definition of available plugins
 * @type {object.<String, object>}
 */
QueryBuilder.plugins = {};

/**
 * Localized strings (see i18n/)
 * @type {object.<string, object>}
 * @readonly
 */
QueryBuilder.regional = {};

/**
 * Registers or updates a new translation
 * @param {object} lang
 * @param {boolean} [setDefault=false]
 */
QueryBuilder.addLocale = function (lang, setDefault) {
    if (!lang.__code) {
        error('ConfigError', 'Locale has no code');
    }

    QueryBuilder.regional[lang.__code] = $.extend(true, QueryBuilder.regional[lang.__code] || {}, lang);

    if (setDefault) {
        QueryBuilder.defaults({lang_code: lang.__code});
    }
};

/**
 * Gets or extends the default configuration
 * @param {object} [options] - new configuration
 * @returns {undefined|object} nothing or configuration object (copy)
 */
QueryBuilder.defaults = function (options) {
    if (typeof options == 'object') {
        $.extendext(true, 'replace', QueryBuilderDefaults, options);
    }
    else if (typeof options == 'string') {
        if (typeof QueryBuilderDefaults[options] == 'object') {
            return $.extend(true, {}, QueryBuilderDefaults[options]);
        }
        else {
            return QueryBuilderDefaults[options];
        }
    }
    else {
        return $.extend(true, {}, QueryBuilderDefaults);
    }
};

/**
 * Registers a new plugin
 * @param {string} name
 * @param {function} fct - init function
 * @param {object} [def] - default options
 */
QueryBuilder.define = function (name, fct, def) {
    QueryBuilder.plugins[name] = {
        fct: fct,
        def: def || {}
    };
};

/**
 * Adds new methods to QueryBuilder prototype
 * @param {object.<string, function>} methods
 */
QueryBuilder.extend = function (methods) {
    $.extend(QueryBuilder.prototype, methods);
};

/**
 * Initializes plugins for an instance
 * @throws ConfigError
 * @private
 */
QueryBuilder.prototype.initPlugins = function () {
    if (!this.plugins) {
        return;
    }

    if ($.isArray(this.plugins)) {
        var tmp = {};
        this.plugins.forEach(function (plugin) {
            tmp[plugin] = null;
        });
        this.plugins = tmp;
    }

    Object.keys(this.plugins).forEach(function (plugin) {
        if (plugin in QueryBuilder.plugins) {
            this.plugins[plugin] = $.extend(true, {},
                QueryBuilder.plugins[plugin].def,
                this.plugins[plugin] || {}
            );

            QueryBuilder.plugins[plugin].fct.call(this, this.plugins[plugin]);
        }
        else {
            error('Config', 'Unable to find plugin "{0}"', plugin);
        }
    }, this);
};

/**
 * Returns the config of a plugin, if the plugin is not loaded, returns the default config.
 * @param {string} name
 * @param {string} [property]
 * @throws ConfigError
 * @returns {*}
 */
QueryBuilder.prototype.getPluginOptions = function (name, property) {
    var plugin;
    if (this.plugins && this.plugins[name]) {
        plugin = this.plugins[name];
    }
    else if (QueryBuilder.plugins[name]) {
        plugin = QueryBuilder.plugins[name].def;
    }

    if (plugin) {
        if (property) {
            return plugin[property];
        }
        else {
            return plugin;
        }
    }
    else {
        error('Config', 'Unable to find plugin "{0}"', name);
    }
};
