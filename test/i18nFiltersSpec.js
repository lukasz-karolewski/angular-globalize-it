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