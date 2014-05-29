[![Build Status](https://travis-ci.org/kether667/angular-globalize-it.svg?branch=master)](https://travis-ci.org/kether667/angular-globalize-it)
angular-globalize-it 
============
angular-globalize-it is a wrapper around jquery.globalize library. 
It provides you with means to fully internationalize and localize you angular application.

##installation 


    bower install angular-globalize-it


##Internationalization
-------------
has 2 main aspects:

* Regional format support (dates, number formatting, percentage, sorting, unicode support)  additionally usually timezone handling falls under here too
* Language of the interface (called localization)

###Regional Format support

To format date use i18nDate or i18nDateTime filters. i.e.:
```
<td>{{ obj.apply_date | i18nDate }}</td>
```
This will format your date just fine.
Your object ideally should be a string in ISO8601 (2014-05-26T13:14:14Z) format. Epoch time in seconds or milliseconds works too but there's no way to handle timezones correctly with this format.

Respectively
To format number use i18nNumber
To format percentage use i18nPercent
```
<td>{{ obj.fraction | i18nPercent}}</td> <- GOOD
<td>{{ obj.fraction | i18nNumber }}%</td> <- WRONG
```

###Localization

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

### general localiztion best practices

* Always put full sentence or full paragraph into single resource key.
* Use placeholders to fill in with parameters.

Using resources
in a partial:
use res-key directive with res-param attribute. Example:
```
<span res-key="account.licensing.spaceusage" res-params="licenseInfo.storage.used | i18nNumber, licenseInfo.storage.max | i18nNumber">String inside will be replaced with content from resources</span>
```
where account.licensing.spaceusage is a resource key from resources-default.js file

res-key is a string and a key in resource dictionary. (naming convention described below)
res-params is a comma separated list of expressions

in a controller, factory, or anywhere else inject i18nservice and use translate method


i18nService.translate(key, param1, param2, ...) - with params


###handling pluralization
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
