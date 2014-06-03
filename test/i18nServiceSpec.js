'use strict';

describe('Provider: i18nService', function () {
    var i18nService;

    describe('formatting with default culture', function () {
        beforeEach(module('angular-globalize-it'));

        // instantiate service
        beforeEach(inject(function (_i18nService_) {
            i18nService = _i18nService_;
        }));

        it('should create service with en culture and en-US uiCulture as defaults', function () {
            expect(i18nService.currentCulture()).toBe('en-US');
            expect(i18nService.currentUICulture()).toBe('en');
        });

        it('should format number correctly', function () {
            //when not specified
            expect(i18nService.formatNumber(5.5)).toBe('5.50');

            expect(i18nService.formatNumber(5.5, 'number')).toBe('5.5');
            expect(i18nService.formatNumber(0.055, 'percent')).toBe('5.50 %');
            expect(i18nService.formatNumber(5.5, 'currency')).toBe('$5.50');

            //custom globalize format
            expect(i18nService.formatNumber(5.5, 'i')).toBe('5.5');
        });

        it('should format date correctly', function () {

            var date = new Date(2012, 4 - 1, 14, 13, 14, 15);

            //when not specified
            expect(i18nService.formatDate(date)).toBe('Saturday, April 14, 2012 1:14 PM');

            expect(i18nService.formatDate(date, 'date')).toBe('4/14/2012');
            expect(i18nService.formatDate(date, 'time')).toBe('1:14 PM');
            expect(i18nService.formatDate(date, 'datetime')).toBe('Saturday, April 14, 2012 1:14 PM');

            //custom globalize format
            expect(i18nService.formatDate(date, 'invalid format equals to datetime')).toBe('Saturday, April 14, 2012 1:14 PM');
        });
    });

    describe('formatting with pl culture', function () {
        //creating fake module to test provider methods
        beforeEach(function () {
                angular.module('fake', [])
                    .config(function (i18nServiceProvider) {
                        i18nServiceProvider.setCulture('pl-PL');
                        i18nServiceProvider.setUICulture('pl');
                    });

                module('angular-globalize-it', 'fake');
            }
        );

        // instantiate service
        beforeEach(inject(function (_i18nService_) {
            i18nService = _i18nService_;
        }));

        it('should create service with correct culture and uiCulture', function () {
            expect(i18nService.currentCulture()).toBe('pl-PL');
            expect(i18nService.currentUICulture()).toBe('pl');
        });

        it('should format number correctly', function () {
            //when not specified
            expect(i18nService.formatNumber(5.5)).toBe('5,50');

            expect(i18nService.formatNumber(5.5, 'number')).toBe('5.5');
            expect(i18nService.formatNumber(0.055, 'percent')).toBe('5,50%');
            expect(i18nService.formatNumber(5.5, 'currency')).toBe('5,50 zł');

            //custom globalize format
            expect(i18nService.formatNumber(5.5, 'i')).toBe('5.5');
        });

        it('should format date correctly', function () {

            var date = new Date(2012, 4 - 1, 4, 13, 14, 15);

            //when not specified
            expect(i18nService.formatDate(date)).toBe('4 kwietnia 2012 13:14');

            expect(i18nService.formatDate(date, 'date')).toBe('2012-04-04');
            expect(i18nService.formatDate(date, 'time')).toBe('13:14');
            expect(i18nService.formatDate(date, 'datetime')).toBe('4 kwietnia 2012 13:14');

            //custom globalize format
            expect(i18nService.formatDate(date, 'invalid format equals to datetime')).toBe('4 kwietnia 2012 13:14');
        });
    });

    describe('translate key and get pluralized values', function () {
        //creating fake module to test provider methods
        beforeEach(function () {
                angular.module('fake', [])
                    .config(function (i18nServiceProvider) {
                        i18nServiceProvider.setCulture('pl-PL');
                        i18nServiceProvider.setUICulture('pl');
                        i18nServiceProvider.addNamedParameter('namedParam', 'angular-globalize-it');

                        //artificially filling out translation dictionary
                        Globalize.addCultureInfo('default', {
                            messages: {
                                'test.key.with.params': 'second param is {1}, first param is {0}',
                                'test.key.with.params.and.named.param': '{namedParam} second param is {1}, first param is {0} {namedParam}',
                                'pluralized.test.zero': 'zero',
                                'pluralized.test.one': 'one',
                                'pluralized.test.two': 'two',
                                'pluralized.test.few': 'few',
                                'pluralized.test.many': 'many',
                                'pluralized.test.other': 'other'
                            }
                        });
                    });

                module('angular-globalize-it', 'fake');
            }
        );

        // instantiate service
        beforeEach(inject(function (_i18nService_) {
            i18nService = _i18nService_;
        }));

        it('should retrieve value of resource and fill in with params', function () {
            expect(i18nService.translate('test.key.with.params', 123, 321)).toBe('second param is 321, first param is 123');
        });

        it('should replace numbered params and named param', function () {
            expect(i18nService.translate('test.key.with.params.and.named.param', 123, 321)).toBe('angular-globalize-it second param is 321, first param is 123 angular-globalize-it');
        });

        it('should not fail when key doesnt exist or is empy', function () {
            expect(i18nService.translate()).toBe(undefined);
            expect(i18nService.translate('key.doesnt.exist')).toBe(undefined);
        });

        it('should return proper dictionary for pluralized values', function () {
            var result = i18nService.getPluralizedValues('pluralized.test');
            expect(Object.keys(result).length).toBe(6);
            expect(result.zero).toBe('zero');
            expect(result.one).toBe('one');
            expect(result.two).toBe('two');
            expect(result.few).toBe('few');
            expect(result.many).toBe('many');
            expect(result.other).toBe('other');
        });

        it('should return proper dictionary for pluralized values', function () {
            var result = i18nService.getPluralizedValues('pluralized.test.not.present');
            expect(Object.keys(result).length).toBe(6);
            expect(result.zero).toBe('');
            expect(result.one).toBe('');
            expect(result.two).toBe('');
            expect(result.few).toBe('');
            expect(result.many).toBe('');
            expect(result.other).toBe('');
        });
    });
});