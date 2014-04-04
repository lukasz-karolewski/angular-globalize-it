describe('Directive: resKey', function () {
    var ele, scope;

    //creating fake module to test provider methods
    beforeEach(function () {
            var fakeModule = angular.module('fake', [])
                .config(function (i18nServiceProvider) {
                    i18nServiceProvider.setCulture('pl-PL');
                    i18nServiceProvider.setUICulture('pl');

                    //artificially filling out translation dictionary
                    Globalize.addCultureInfo('default', {
                        messages: {
                            'test': 'this is a test'
                        }
                    });
                });

            module('angular.i18n', 'fake');
        }
    );

    // instantiate service
    beforeEach(inject(function (_i18nService_) {
        i18nService = _i18nService_;
    }));

    describe('', function () {
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope;
            ele = angular.element(
                '<span res-key="test"></span>'
            );
            $compile(ele)(scope);
            scope.$apply();
        }));

        it('should put resource value inside the element', function () {
            expect(ele.html()).toBe('this is a test');
        });
    });
});