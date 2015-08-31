# jQuery Select All Checkboxes Plugin
jQuery plugin to handle "select all checkboxes" behavior:
- when a "select all" checkbox changes state, all related checkboxes change state accordingly;
- when all checkboxes are checked, the "select all" checkbox is also checked;
- when at least one checkbox is unchecked, the "select all" checkbox is unchecked.

## How to

### Basic usage
Consider the following HTML:

```html
<input type="checkbox" class="selectAll"> Select all<br />
<input type="checkbox" value="AAA" name="c1"> AAA<br />
<input type="checkbox" value="BBB" name="c1"> BBB<br />
<input type="checkbox" value="CCC" name="c1"> CCC<br />
```

To enable the select all plugin:

```javascript
$(".selectAll").selectAll();
```

This call will setup event handlers to monitor changes in the "select all" checkbox and in the other checkboxes. It will also update the state of the "select all" checkbox in case all checkboxes are already checked.

All checkboxes will be targeted by default.

### Target specific checkboxes
If you want to target specific checkboxes, pass a checkbox selector string:

```javascript
$(".selectAll").selectAll(".checkbox");
```

### Alternative usage
Alternatively, you can call the plugin on a parent container:

```javascript
$(".container").selectAll({
	container: true,			// specify that we are using it on a container
	selectAll: ".selectAll",	// the "select all" checkbox selector string
	checkbox: ".checkbox"		// optionally target specific checkboxes
});
```

This usage has several advantages:
- If you have several groups of checkboxes with the same classes on their own containers, this will apply the "select all" behavior appropriately to all of them.
- Support for dynamic DOM changes. If checkboxes are being added/removed dynamically on the page, you can call this beforehand on a container. When a checkbox is added/removed, the state of the "select all" checkbox will be updated (this last part doesn't work on IE10 or below).

### Override defaults
You can override the default options:

```javascript
$.fn.selectAll.defaults = {
	checkbox: "input[type='checkbox']",
	container: false,
	selectAll: ".selectAll"
};
```
