'use strict';

angular.module('angular.i18n')
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