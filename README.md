[![Build Status](https://travis-ci.org/kether667/angular-globalize-it.svg?branch=master)](https://travis-ci.org/kether667/angular-globalize-it)
angular-globalize-it 
============


The way to fully internationalize and localize you angular application.


##why angular-globalize-it?


In angular-translate you're allowed to use scope property names in your resource.
This tightly couples implementation details (variable names) with resources. When you need to refactor that controller you mess up translations.
I don't know how about you but I don't like surprises :)


##installation 


    `bower install angular-globalize-it --save`


##Internationalization
-------------
There are 3 level of internationalization:
* L0 - Product is functional on localized system in localized environment
* L1 - L0 + Regional format support
    * character handling (anything user types in any language will be handled correctly by system)
    * dates, number formatting (decimal point), percentage, sorting
    * (optional) usually timezone handling falls under here
* L2 - L1 + localization, interface of you application is translated
    * watch out for hardcoded strings and concatenations

###L0 It's up to you :)

###L1 Regional format support

To format date use i18nDate or i18nDateTime filters. i.e.:
```
<td>{{ obj.apply_date | i18nDate }}</td>
```
This will format your date just fine. There is no customization by design, it will format your date as it's expected in particular region of the world.
Your object ideally should be a string in ISO8601 (2014-05-26T13:14:14Z) format. Epoch time in seconds or milliseconds works too but it's not recommended. That is because in theory timezone is implied be UTC, but in practice i often saw it in you server local timezone and then there's lot of confusion

Respectively
To format number use i18nNumber
To format percentage use i18nPercent
```
<td>{{ obj.fraction | i18nPercent}}</td> <- GOOD
<td>{{ obj.fraction | i18nNumber }}%</td> <- WRONG - do not concatenate strings - impossible to translate
```

###L2 Localization

In order to translate user interface, all strings should be in resource files.
Each module should have a resources directory with resources-default.js file:

```javascript
'use strict';
Globalize.addCultureInfo('default', {
messages: {
    '<module name>.<partial name>.<key name>': 'It supports placeholders like this one {0}. All placeholders are numbered. This is another one {1}',
}
});
```
This is a key value pair dictionary. {0}, {1} are placeholders for the parameters.

### general localization best practices

* Always put full sentence or full paragraph into single resource key.
* Use placeholders to fill in with parameters.

####Using resources
* in a partial:
prefer `{{ ::'resource.key' | translate : param1 : paramN }}`. However if you need to format your param as date, number etc. use `res-key` directive.

example:
```html
<span res-key="account.licensing.spaceusage" res-params="licenseInfo.storage.used | i18nNumber, licenseInfo.storage.max | i18nNumber">String inside will be replaced with content from resources</span>
```
where account.licensing.spaceusage is a resource key from resources-default.js file

`res-key` is a string and a key in resource dictionary. (naming convention described below)
`res-params` is a comma separated list of expressions

* in a controller, factory, or anywhere else inject i18nService and use translate method
```javascript
i18nService.translate(key, param1, param2, ...) - with params
```

####named parameters
imagine you need to change name of your product 
```javascript
    angular.module('sample', ['angular-globalize-it'])
        .config(function (i18nServiceProvider) {
                // product name will be available in all resources for use, you don't have to pass this param value everywhere
                i18nServiceProvider.addNamedParameter('productName', 'angular-globalize-it');
        })
```

###handling pluralization - NOT IMPLEMENTED YET - PR welcome :)
```
<ng-pluralize count="licenseInfo.users.count" when="i18n.getPlularizedValues(keyBase)"></ng-pluralize>
```
keyBase is a root of a key. Having keyBase = 'module.availableDevices'
resource file should define following keys:
'module.availableDevices.zero',
'module.availableDevices.one',
'module.availableDevices.two',
'module.availableDevices.few',
'module.availableDevices.many',
'module.availableDevices.other
