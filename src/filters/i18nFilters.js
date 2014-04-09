'use strict';

angular.module('angular.i18n')

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