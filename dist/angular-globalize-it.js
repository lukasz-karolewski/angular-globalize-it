/* angular-globalize-it-1.0.3 09-04-2014 */
"use strict";
// Source: src/app.js
angular.module('angular-globalize-it', []);
// Source: src/services/i18nService.js
angular.module('angular-globalize-it')
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

// Source: src/filters/i18nFilters.js
angular.module('angular-globalize-it')

    .filter('i18nDate', ['i18nService', function (i18nService) {
        return function (input) {
            if (!input) {return '';}

            //FIXME this is a temporary deliberate hack iso8601 format is expected.
            if (typeof(input) == 'number' && parseInt(input) < 10000000000) {
                input = parseInt(input) * 1000;
            }
            return i18nService.formatDate(new Date(input), 'date');
        };
    }])

    //custom format of short date and
    .filter('i18nDateTime', ['i18nService', function (i18nService) {
        return function (input) {
            if (!input) {return '';}

            //FIXME this is a temporary deliberate hack iso8601 format is expected.
            if (typeof(input) == 'number' && parseInt(input) < 10000000000) {
                input = parseInt(input) * 1000;
            }
            return i18nService.formatDate(new Date(input), 'date') + ' ' + i18nService.formatDate(new Date(input), 'time');
        };
    }])

    .filter('i18nNumber', ['i18nService', function (i18nService) {
        return function (input) {
            return i18nService.formatNumber(input, 'number');
        };
    }])

    .filter('i18nPercent', ['i18nService', function (i18nService) {
        return function (input) {
            return i18nService.formatNumber(input, 'percent');
        };
    }]);
// Source: src/directives/resKey.js
angular.module('angular-globalize-it')
    .directive('resKey', ['i18nService',
        function (i18nService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    // watch scope for changes and update translations
                    scope.$watch(function () {
                        doTranslate();
                    });

                    var translatableAttrs = ['placeholder', 'alt', 'title'];

                    function doTranslate() {
                        //translate innerHTML
                        var args = [attrs.resKey];
                        if (attrs.resParams) {
                            angular.forEach(attrs.resParams.split(','), function (value) {
                                args.push(scope.$eval(value.trim()));
                            });
                        }
                        element.html(i18nService.translate.apply(i18nService, args));

                        //translate attributes
                        angular.forEach(translatableAttrs, function (attr) {
                            args[0] = attrs.resKey + '.' + attr;
                            var value = i18nService.translate.apply(i18nService, args);
                            if (value) {
                                attrs.$set(attr, value);
                            }
                        });
                    }
                }
            };
        }]);