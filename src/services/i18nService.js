'use strict';

angular.module('angular.i18n')
    .provider('i18nService', [function () {
        var culture = 'en-US';
        var uiCulture = 'en';

        this.setCulture = function (_culture_) {
            culture = _culture_;
        };

        this.setUICulture = function (_uiCulture_) {
            uiCulture = _uiCulture_;
        };

        this.$get = function () {
            return new I18nService(culture, uiCulture);
        };

        //i18nService definition
        var I18nService = function (culture, uiCulture) {
            this.culture = culture;
            this.uiCulture = uiCulture;
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
            arguments[0] = Globalize.localize(key, this.uiCulture);

            return format.apply(null, arguments);
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

        //port of .net String.format method
        function format()  {
            var s = arguments[0];
            
            if (typeof s != 'undefined') {
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp('\\{' + i + '\\}', 'gm');
                    s = s.replace(reg, arguments[i + 1]);
                }
            }
            return s;
        }

    }]);
