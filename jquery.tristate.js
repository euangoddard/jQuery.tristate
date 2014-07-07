(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var self = {
        init: function () {

            return this.each(function () {
                var $checkbox = $(this),
                    data = $checkbox.data('tristate'),
                    initial_state = null,
                    data_tristate;
                
                if (!$checkbox.is(':checkbox')) {
                    // There's no point in making anything other than a checkbox
                    // become a tristate checkbox, so skip this:
                    return true;
                }
                
                // Determine the initial state. First see whether the
                // "data-tristate" attribute is set:
                data_tristate = $checkbox.attr('data-tristate'); 
                if (data_tristate) {
                    // Validate that this state is valid:
                    initial_state = $.tristates[data_tristate];
                }
                
                // If the data-tristate attribute is not set or is invalid, fall
                // back to reading the checked state of the box:
                if (!initial_state) {
                    initial_state = $checkbox.is(':checked') ? 
                        $.tristates.checked : $.tristates.unchecked;
                } 
                
                // Ensure that the state of the box matches the state (in case
                // of contradictory data-tristate and checked attributes). This
                // will also set the correct data attribute:
                self._set_state.apply($checkbox, [initial_state]);
                
                // Override the default click handler on tristate checkboxes:
                $checkbox.bind('click.tristate', self._cycle_state);
    	    });
        },
        state: function (new_state) {
            // Get or set the state of the checkbox(es) specified
            
            // Verify that this box has been converted to a tristate checkbox:
            if (!$(this).data('tristate')) {
                $.error('You must first set the checkbox(es) to be a tristate checkbox before calling this method')
            }
            
            if (typeof new_state === 'undefined') {
                return self._get_state.apply(this);
            } else {
                return self._set_state.apply(this, [new_state]);
            }
        },
        _get_state: function () {
            // Getter for the current state of the checkox(es) specified
            var $this = $(this),
                current_states;
            
            if ($this.length === 1) {
                // Special case the instance of a single checkbox:
                current_states = $this.data('tristate');
            } else {
                current_states = {};
                this.each(function (index, checkbox) {
                    var $checkbox = $(checkbox),
                        id = $checkbox.attr('id') || index;
                    
                    current_states[id] = $checkbox.data('tristate');
                });
            }
            
            return current_states;
            
        },
        _set_state: function (new_state) {
            // Setter for an updated state of the checkox(es) specified
            
            var $checkboxes = $(this),
                state_to_set = $.tristates[new_state]; 
            
            // Validate the new_state:
            if (typeof state_to_set === 'undefined') {
                $.error('You cannot set a tristate checkbox to: ' + new_state);
            }
            
            switch (state_to_set) {
                case $.tristates.unchecked:
                    $checkboxes.removeAttr('checked').css({opacity: 1});
                    break;
                case $.tristates.checked:
                    $checkboxes.attr({checked: 'checked'}).css({opacity: 1});
                    break;
                case $.tristates.mixed:
                    $checkboxes.attr({checked: 'checked'}).css({opacity: mixed_opacity});
                    break;
            }
            
            $checkboxes.data('tristate', state_to_set);
            
        },
        _cycle_state: function (event) {
            // Cycle through the state of the checkbox. The allowed transitions are:
            //  * unchecked --> checked
            //  * mixed --> checked
            //  * checked --> unchecked
            // NB: Therefore it is not possible to get to a mixed state by
            // clicking on a tristate checkbox, this state can only be achieved
            // by external means.
            
            event.preventDefault();
            
            var $checkbox = $(this),
                new_state;
                
            // Add a timeout to ensure that the DOM has correctly been updated
            // before trying to alter the state of the checkbox:
            setTimeout(function () {
                switch (self._get_state.apply($checkbox)) {
                    case $.tristates.unchecked:
                    case $.tristates.mixed:
                        new_state = $.tristates.checked;
                        break;
                    case $.tristates.checked:
                        new_state = $.tristates.unchecked;
                        break;
                    default:
                        $.error('Unrecognized state for checkbox');
                }
                self._set_state.apply($checkbox, [new_state]);
            }, 13);
            
            return false;
        },
        _debug: function (message) {
            // Output any arguments to the console if available:
            window.console && console.debug.apply(console, arguments);
        }
    },
    mixed_opacity = 0.5;
    
    $.fn.tristate = function (method) {
        if (self[method] && method.substr(0, 1) !== '_') {
            return self[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return self.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.tristate');
        }  
    };
    $.tristates = {
        'checked': 'checked',
        'unchecked': 'unchecked',
        'mixed': 'mixed'
    };
    
}));
