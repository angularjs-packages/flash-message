# Angular Bootstrap flash message

A fork from the `angular-flash` project, with two aims; to have the flash messages use the 
Bootstrap styling and have the option to timeout messages.

# Installation

`bower install flash-message --save`

# Usage

```js
angular.controller("Test", [
 '$scope',
 'flashMessage',
 function($scope, flashMessage) {
   flash.success({
     text: "Success message",
     seconds: 10
   });
 }]);
```

The module exports the `flashMessage` service with the following methods:

 * `flash.success`
 * `flash.danger`
 * `flash.info`
 * `flash.warning`

Each of these methods take two arguments:
 
 * the flash message
 * (optional) timeout to delete the flash message, in seconds

And in order to render the flash messages, you must add the following directive in your
template:

```html
<div flash-messages></div>
```
