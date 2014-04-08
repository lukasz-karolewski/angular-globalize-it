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
                            'test': 'this is a test',
                            'test.image.alt': 'image alt',
                            'test.image.title' : 'image title',
                            'test.image.placeholder' : 'image placeholder',
                            'test.input': 'input test',
                            'test.input.alt': 'input alt',
                            'test.input.title' : 'input title',
                            'test.input.placeholder' : 'input placeholder'
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

    describe('simple test cases', function () {
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

    describe('testting translation of alt and title attriutes', function () {
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope;
            ele = angular.element(
                '<img res-key="test.image"></img>'
            );
            $compile(ele)(scope);
            scope.$apply();
        }));

        it('should put resource value inside the element', function () {
            expect(ele.attr('alt')).toBe('image alt');
            expect(ele.attr('title')).toBe('image title');
            expect(ele.attr('placeholder')).toBe('image placeholder');
        });
    });

    describe('testting translation of alt and title attriutes', function () {
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope;
            ele = angular.element(
                '<div type="text" res-key="test.input"></div>'
            );
            $compile(ele)(scope);
            scope.$apply();
        }));

        it('should put resource value inside the element', function () {
            expect(ele.attr('alt')).toBe('input alt');
            expect(ele.attr('title')).toBe('input title');
            expect(ele.attr('placeholder')).toBe('input placeholder');
        });
    });
});