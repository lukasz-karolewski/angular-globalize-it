'use strict';

angular.module('angular-globalize-it')
    .filter('i18nNumber', ['i18nService', function (i18nService) {
        return function (input) {
            return i18nService.formatNumber(input, 'number');
        };
    }]);