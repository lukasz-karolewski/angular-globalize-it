'use strict';

describe('Filter: i18nDate', function () {
    // load the filter's module
    beforeEach(module('angular-globalize-it'));

    // initialize a new instance of the filter before each test
    var i18nDate;
    beforeEach(inject(function ($filter) {
        i18nDate = $filter('i18nDate');
    }));

    it('should return correctly formatted date"', function () {
        expect(i18nDate).toBeDefined();

        var date = new Date(2012, 4 - 1, 14, 13, 14, 15);
        expect(i18nDate(date)).toBe('4/14/2012');
    });

    it('should do return empty if null is passed', function () {
        expect(i18nDate(null)).toBe('');
    });

});