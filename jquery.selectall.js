/*!
 * jQuery Select All Checkboxes Plugin
 * https://github.com/nunof07/jquery-selectall
 * @version 0.1.0
 * @author Nuno Freitas (nunofreitas@gmail.com)
 * @license https://raw.githubusercontent.com/nunof07/jquery-selectall/master/LICENSE
 */
/* global jQuery */
;(function ($) {
	"use strict";
	
	/**
	 * jQuery plugin to handle "select all checkboxes" behavior:
	 * 		when a "select all" checkbox changes state, all related checkboxes change state accordingly;
	 * 		when all checkboxes are checked, the "select all" checkbox is also checked;
	 * 		when at least one checkbox is unchecked, the "select all" checkbox is unchecked.
	 * Can either be called on a "select all" checkbox or on a parent container. When dynamically adding checkboxes to the DOM, the call should be made on the parent container.
	 * The checked state of the "select all" checkbox is initialized when calling this method, so if for example all checkboxes are already checked before calling this method,
	 * the "select all" checkbox will update its state accordingly.
	 * @param {object|string} options - (optional) Either a string with the checkbox selector or an object with options (@see $.fn.selectAll.defaults).
	 * @returns {jQuery} - The original jQuery object to preserve chaining
	 */
	$.fn.selectAll = function(options) {
		if (typeof options === "string") {
			// if argument is a string assume checkbox selector
			options = {checkbox: options};
		}
		var settings = $.extend({}, $.fn.selectAll.defaults, options);
		
		if (settings.container) {
			// make sure checkbox selector excludes the "select all" checkbox
			var checkboxSelector = settings.checkbox + ":not(" + settings.selectAll + ")";
			
			$(this).each(function () {
				var $container = $(this);
				
				$container.on("change", settings.selectAll, function () {
					setCheckboxesState(
						$(this),
						$(checkboxSelector, $container));
				});
				$container.on("change", checkboxSelector, function () {
					setSelectAllState(
						$(settings.selectAll, $container),
						$(checkboxSelector, $container));
				});
			
				// set initial state of "select all" checkbox
				setSelectAllState(
					$(settings.selectAll, $container),
					$(checkboxSelector, $container));
				
				if (MutationObserver) {
					// listen to DOM changes
					// when new checkboxes are added/removed update state of "select all" checkbox
					// not supported by IE10 or below
					new MutationObserver(function (mutations) {
						for (var i = 0; i < mutations.length; i += 1) {
							if (onNodesChange(mutations[i].addedNodes, $container, settings.selectAll, checkboxSelector)
								|| onNodesChange(mutations[i].removedNodes, $container, settings.selectAll, checkboxSelector)) {
								break;
							}
						}
					}).observe(this, {childList: true, subtree: true});
				}
			});
		} else {
			// cache elements
			// and make sure $checkboxes doesn't include "select all" checkbox
			var $selectAll = this,
				$checkboxes = $(settings.checkbox).not($selectAll);
			
			$selectAll.change(function () {
				setCheckboxesState($selectAll, $checkboxes);
			});
			$checkboxes.change(function () {
				setSelectAllState($selectAll, $checkboxes);
			});
			
			// set initial state of "select all" checkbox
			setSelectAllState($selectAll, $checkboxes);
		}
		
		return this;
	};
	
	function onNodesChange(nodes, $container, selectAllSelector, checkboxSelector) {
		if (nodes) {
			for (var j = 0; j < nodes.length; j += 1) {
				var $node = $(nodes[j]);
				
				if ($node.is(selectAllSelector) || $node.is(checkboxSelector)
					|| $node.has(selectAllSelector) || $node.has(checkboxSelector)) {
					setSelectAllState(
						$(selectAllSelector, $container),
						$(checkboxSelector, $container));
						
					return true;
				}
			}
		}
		
		return false;
	}
	
	function setCheckboxesState($selectAll, $checkboxes) {
		// update checkboxes with the same checked state
		// as the "select all" checkbox
		$checkboxes.prop(
			"checked",
			$selectAll.prop("checked"));
	}
	
	function setSelectAllState($selectAll, $checkboxes) {
		// "select all" should be checked when all checkboxes are checked
		// otherwise it should be unchecked
		$selectAll.prop(
			"checked",
			($checkboxes.length === $checkboxes.filter(":checked").length));
	}
	
	// default options
	$.fn.selectAll.defaults = {
		// checkbox selector
		// by default targets all checkboxes
		checkbox: "input[type='checkbox']",
		
		// whether the plugin was called on a container
		// you should use this if checkboxes are added dynamically to the DOM
		container: false,
		
		// "select all" checkbox selector
		// only needed when calling the plugin on a container
		selectAll: ".selectAll"
	};
}(jQuery));