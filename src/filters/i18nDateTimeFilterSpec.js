'use strict';

describe('Filter: i18nDateTime', function () {
    // load the filter's module
    beforeEach(module('angular-globalize-it'));

    // initialize a new instance of the filter before each test
    var i18nDateTime;
    beforeEach(inject(function ($filter) {
        i18nDateTime = $filter('i18nDateTime');
    }));

    it('should return correctly formatted date with time ', function () {
        expect(i18nDateTime).toBeDefined();

        var date = new Date(2012, 4 - 1, 14, 13, 14, 15);
        expect(i18nDateTime(date)).toBe('4/14/2012 1:14 PM');
    });

    it('should do return empty if null is passed', function () {
        expect(i18nDateTime(null)).toBe('');
    });
});