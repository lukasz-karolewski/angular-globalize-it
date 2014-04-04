angular.module('angular.i18n')
    .directive('resKey', ['i18nService', '$log',
        function (i18nService, $log) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    // watch scope for changes and update translations
                    scope.$watch(function (scope) {
                        doTranslate();
                    });

                    var translatableAttrs = ["placeholder", "alt", "title"];

                    function doTranslate() {
                        //translate innerHTML
                        var args = [i18nService.translate(attrs.resKey)];
                        if (attrs.resParams) {
                            angular.forEach(attrs.resParams.split(','), function (value, index) {
                                args.push(scope.$eval(value.trim()));
                            });
                        }
                        element.html(String.format.apply(null, args));

                        //translate attributes
                        angular.forEach(translatableAttrs, function (attr) {
                            var resourceKey = i18nService.translate(attrs.resKey + "." + attr);
                            if (resourceKey) {
                                args[0] = resourceKey;
                                attrs.$set(attr, String.format.apply(null, args));
                            }
                        });
                    }
                }
            };
        }]);