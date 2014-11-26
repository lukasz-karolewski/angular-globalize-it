'use strict';

describe('Filter: i18nPercent', function () {
    // load the filter's module
    beforeEach(module('angular-globalize-it'));

    // initialize a new instance of the filter before each test
    var i18nPercent;
    beforeEach(inject(function ($filter) {
        i18nPercent = $filter('i18nPercent');
    }));

    it('should return the input prefixed with "ftmDate filter:"', function () {
        expect(i18nPercent).toBeDefined();

        var nb = 0.055;
        expect(i18nPercent(nb)).toBe('5.50 %');
    });
});