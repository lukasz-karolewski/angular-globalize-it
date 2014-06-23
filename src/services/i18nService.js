'use strict';

angular.module('angular-globalize-it')
    .provider('i18nService', [function () {
        var self = this;

        //defaults
        var culture = 'en-US';
        var uiCulture = 'en';
        var namedParams = {};


        self.setCulture = function (_culture_) {
            culture = _culture_;
        };

        self.setUICulture = function (_uiCulture_) {
            uiCulture = _uiCulture_;
        };

        self.addNamedParameter = function (name, value) {
            namedParams[name] = value;
        };

        self.addNamedParameters = function (dict) {
            angular.forEach(dict, function (value, key) {
                    self.addNamedParameter(key, value);
                }
            );
        };

        self.$get = function () {
            return new I18nService(culture, uiCulture, namedParams);
        };

        //i18nService definition
        var I18nService = function (culture, uiCulture, namedParams) {
            this.culture = culture;
            this.uiCulture = uiCulture;
            this.namedParams = namedParams;
        };

        I18nService.prototype.currentCulture = function () {
            return this.culture;
        };

        I18nService.prototype.currentUICulture = function () {
            return this.uiCulture;
        };

        I18nService.prototype.formatDate = function (date, format) {
            switch (format) {
                case 'date':
                    return Globalize.format(date, 'd', this.culture);
                case 'time':
                    return Globalize.format(date, 't', this.culture);
                case 'datetime':
                    return Globalize.format(date, 'f', this.culture);
                default:
                    return Globalize.format(date, 'f', this.culture);
            }
        };

        I18nService.prototype.formatNumber = function (number, format) {
            switch (format) {
                case undefined:
                    return Globalize.format(number, 'n', this.culture);
                case 'number':
                    return Globalize.format(number, 'i', this.culture);
                case 'percent':
                    return Globalize.format(number, 'p', this.culture);
                case 'currency':
                    return Globalize.format(number, 'c', this.culture);
                default:
                    return Globalize.format(number, format, this.culture);
            }
        };

        I18nService.prototype.translate = function (key) {
            var keyValue = Globalize.localize(key, this.uiCulture);
            var argumentsDict = angular.copy(this.namedParams);

            for (var i = 0; i < arguments.length; i++) {
                if (i === 0) {
                    continue;
                }
                argumentsDict[i - 1] = arguments[i];
            }
            return format.apply(null, [keyValue, argumentsDict]);
        };

        I18nService.prototype.getPluralizedValues = function (key) {
            var self = this;

            var whenValues = {};
            angular.forEach(['zero', 'one', 'two', 'few', 'many', 'other'], function (value) {
                var tmp = self.translate(key + '.' + value);
                whenValues[value] = tmp || '';
            });
            return whenValues;
        };

        // first arg is a string with placeholders,
        // second arg is a dictionary of vars to replace, key is supposed to be surrounded with angle brackets
        function format() {
            var s = arguments[0];
            if (typeof s != 'undefined') {
                angular.forEach(arguments[1], function (value, key) {
                    var reg = new RegExp('\\{' + key + '\\}', 'gm');
                    s = s.replace(reg, value);
                });
            }
            return s;
        }

    }]);
