# jQuery.tristate

A jQuery plugin to convert checkboxes allowing a third (partially selected) state.

## Usage

Include jquery.tristate in your HTML, e.g.

```html
<script type="text/javascript" src="jquery.tristate.js">
```

Then in in the DOM ready event handler, tell the plug-in which element(s) you
want to be tristate checkboxes:

```javascript
$(function () {
    $('.tristate').tristate();
});
```

### AMD

Alternatively you can include the module with require.js or similar:

```javascript
require(['jquery', 'jquery.tristate'], function ($) {
  $(function () {
    $('.tristate').tristate();
  });
});
```
