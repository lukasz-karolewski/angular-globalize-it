'use strict';


describe('Filter: i18nNumber', function () {
    // load the filter's module
    beforeEach(module('angular-globalize-it'));

    // initialize a new instance of the filter before each test
    var i18nNumber;
    beforeEach(inject(function ($filter) {
        i18nNumber = $filter('i18nNumber');
    }));

    it('should return the input prefixed with "ftmDate filter:"', function () {
        expect(i18nNumber).toBeDefined();

        var nb = 5.5;
        expect(i18nNumber(nb)).toBe('5.5');
    });
});
