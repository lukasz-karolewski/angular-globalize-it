'use strict';

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