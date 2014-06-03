'use strict';

angular.module('angular-globalize-it')
    .filter('translate', ['i18nService', function (i18nService) {
        return function () {
            return i18nService.translate.apply(i18nService, arguments);
        };
    }]);