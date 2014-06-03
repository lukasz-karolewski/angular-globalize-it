'use strict';

describe('Filter: translate', function () {
    // load the filter's module
    beforeEach(module('angular-globalize-it'));

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
                            'test.key.with.params.and.named.param': '{namedParam} second param is {1}, first param is {0} {namedParam}'
                        }
                    });
                });

            module('angular-globalize-it', 'fake');
        }
    );

    // initialize a new instance of the filter before each test
    var translate;
    beforeEach(inject(function ($filter) {
        translate = $filter('translate');
    }));

    it('should correctly replace positional and named params with values', function () {
        expect(translate).toBeDefined();
        expect(translate("test.key.with.params", "test", "test2")).toBe('second param is test2, first param is test');
        expect(translate("test.key.with.params.and.named.param", "test", "test2")).toBe('angular-globalize-it second param is test2, first param is test angular-globalize-it');
    });
});