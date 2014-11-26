describe('Directive: resKey', function () {
    var ele, scope, $compile;

    function createElement(html) {
        ele = angular.element(html);
        $compile(ele)(scope);
        scope.$apply();
        return ele;
    }

    //creating fake module to test provider methods
    beforeEach(function () {
            angular.module('fake', [])
                .config(function (i18nServiceProvider) {
                    i18nServiceProvider.setCulture('pl-PL');
                    i18nServiceProvider.setUICulture('pl');
                    i18nServiceProvider.addNamedParameter('productName', 'angular-globalize-it');

                    //artificially filling out translation dictionary
                    Globalize.addCultureInfo('default', {
                        messages: {
                            'test': 'this is a test',
                            'test.with.params': 'this is a named param {productName}',
                            'test.image.alt': 'image alt',
                            'test.image.title': 'image title',
                            'test.image.placeholder': 'image placeholder',
                            'test.input': 'input test',
                            'test.input.alt': 'input alt',
                            'test.input.title': 'input title',
                            'test.input.placeholder': 'input placeholder',
                            'test.html' : '<b>bolded</b>'
                        }
                    });
                });

            module('angular-globalize-it', 'fake');
        }
    );

    // instantiate service
    beforeEach(inject(function (_i18nService_, _$rootScope_, _$compile_) {
        i18nService = _i18nService_;
        $compile = _$compile_;
        scope = _$rootScope_.$new();
    }));

    describe('simple test cases', function () {
        it('should put resource value inside the element', function () {
            ele = createElement('<span res-key="test"></span>');

            expect(ele).toBeDefined();
            expect(ele.html()).toBe('this is a test');
        });

        it('should put resource value inside the element', function () {
            ele = createElement('<span res-key="test.with.params"></span>');

            expect(ele).toBeDefined();
            expect(ele.html()).toBe('this is a named param angular-globalize-it');
        });
    });

    describe('html test cases', function () {
        it('should put resource value inside the element', function () {
            ele = createElement('<span res-key="test.html"></span>');

            expect(ele).toBeDefined();
            expect(ele.html()).toBe('<b>bolded</b>');
        });
    });


    describe('testing translation of alt and title attributes of image tag', function () {
        it('should put resource value inside the element', function () {
            ele = createElement('<img res-key="test.image" />');

            expect(ele.attr('alt')).toBe('image alt');
            expect(ele.attr('title')).toBe('image title');
            expect(ele.attr('placeholder')).toBe('image placeholder');
        });
    });

    describe('testing translation of alt and title attributes of div', function () {
        it('should put resource value inside the element', function () {
            ele = createElement('<div res-key="test.input"></div>');

            expect(ele.attr('alt')).toBe('input alt');
            expect(ele.attr('title')).toBe('input title');
            expect(ele.attr('placeholder')).toBe('input placeholder');
        });
    });
});