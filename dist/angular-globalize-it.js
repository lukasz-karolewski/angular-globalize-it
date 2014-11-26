/* angular-globalize-it-1.2.2 26-11-2014 */
"use strict";
// Source: src/app.js
angular.module('angular-globalize-it', ['ngSanitize']);

// Source: src/directives/resKeyDirective.js
angular.module('angular-globalize-it')
    .directive('resKey', ['i18nService', '$sce', function (i18nService, $sce) {
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
                        element.html($sce.getTrustedHtml(i18nService.translate.apply(i18nService, args)));

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
// Source: src/filters/i18nDateFilter.js
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
    }]);
// Source: src/filters/i18nDateTimeFilter.js
angular.module('angular-globalize-it')

    //short date and short time
    .filter('i18nDateTime', ['i18nService', function (i18nService) {
        return function (input) {
            if (!input) {return '';}

            //FIXME this is a temporary deliberate hack iso8601 format is expected.
            if (typeof(input) == 'number' && parseInt(input) < 10000000000) {
                input = parseInt(input) * 1000;
            }
            return i18nService.formatDate(new Date(input), 'date') + ' ' + i18nService.formatDate(new Date(input), 'time');
        };
    }]);
// Source: src/filters/i18nNumberFilter.js
angular.module('angular-globalize-it')
    .filter('i18nNumber', ['i18nService', function (i18nService) {
        return function (input) {
            return i18nService.formatNumber(input, 'number');
        };
    }]);
// Source: src/filters/i18nPercentFilter.js
angular.module('angular-globalize-it')
    .filter('i18nPercent', ['i18nService', function (i18nService) {
        return function (input) {
            return i18nService.formatNumber(input, 'percent');
        };
    }]);
// Source: src/filters/translateFilter.js
angular.module('angular-globalize-it')
    .filter('translate', ['i18nService', function (i18nService) {
        return function () {
            return i18nService.translate.apply(i18nService, arguments);
        };
    }]);
// Source: src/services/i18nService.js
angular.module('angular-globalize-it')
    .provider('i18nService', function () {
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

        self.$get = ['$log', function ($log) {

            function escapeString(string) {
                return string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

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

            return {
                currentCulture: function () {
                    return culture;
                },

                currentUICulture: function () {
                    return uiCulture;
                },

                formatDate: function (date, format) {
                    switch (format) {
                        case 'date':
                            return Globalize.format(date, 'd', culture);
                        case 'time':
                            return Globalize.format(date, 't', culture);
                        case 'datetime':
                            return Globalize.format(date, 'f', culture);
                        default:
                            return Globalize.format(date, 'f', culture);
                    }
                },

                formatNumber: function (number, format) {
                    switch (format) {
                        case undefined:
                            return Globalize.format(number, 'n', culture);
                        case 'number':
                            return Globalize.format(number, 'i', culture);
                        case 'percent':
                            return Globalize.format(number, 'p', culture);
                        case 'currency':
                            return Globalize.format(number, 'c', culture);
                        default:
                            return Globalize.format(number, format, culture);
                    }
                },

                translate: function (key) {
                    var keyValue = Globalize.localize(key, uiCulture);
                    if (typeof (keyValue) === 'undefined') {
                        $log.warn(format.apply(null, ['Missing translation, {0} does not exist', key]));
                    }

                    var argumentsDict = angular.copy(namedParams);
                    var tmp;
                    for (var i = 1; i < arguments.length; i++) {
                        tmp = arguments[i];
                        if (typeof tmp === 'string') {
                            tmp = escapeString(tmp);
                        }
                        argumentsDict[i - 1] = tmp;
                    }
                    return format.apply(null, [keyValue, argumentsDict]);
                },

                getPluralizedValues: function (key) {
                    var self = this;

                    var whenValues = {};
                    angular.forEach(['zero', 'one', 'two', 'few', 'many', 'other'], function (value) {
                        var tmp = self.translate(key + '.' + value);
                        whenValues[value] = tmp || '';
                    });
                    return whenValues;
                }
            };
        }];
    });
