/* jQuery.timeline() */
(function ($) {
    var self = {
        init: function () {

            return this.each(function () {
                var $checkbox = $(this),
                    data = $checkbox.data('tristate'),
                    initial_state = null,
                    data_tristate;
                
                // Determine the initial state. First see whether the
                // "data-tristate" attribute is set:
                data_tristate = $checkbox.attr('data-tristate'); 
                if (data_tristate) {
                    // Validate that this state is valid:
                    initial_state = states[data_tristate];
                }
                
                // If the data-tristate attribute is not set or is invalid, fall
                // back to reading the checked state of the box:
                if (!initial_state) {
                    initial_state = $checkbox.is(':checked') ? 
                        states.checked : states.unchecked;
                } 
                
                // Ensure that the state of the box matches the state (in case
                // of contradictory data-tristate and checked attributes). This
                // will also set the correct data attribute:
                $checkbox.tristate('state', initial_state);
    	    });
        },
        state: function (new_state) {
            // Get or set the state of the checkbox(es) specified
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
            
            if ($this.length == 1) {
                // Special case the instance of a single checkbox:
                current_states = $this.data('tristate');
            } else {
                current_states = {}
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
                state_to_set = states[new_state]; 
            
            // Validate the new_state:
            if (typeof state_to_set === 'undefined') {
                $.error('You cannot set a tristate checkbox to: ' + new_state);
            }
            
            switch (state_to_set) {
                case states.unchecked:
                    $checkboxes.removeAttr('checked').css({opacity: 1});
                    break;
                case states.checked:
                    $checkboxes.attr({checked: 'checked'}).css({opacity: 1});
                    break;
                case states.mixed:
                    $checkboxes.attr({checked: 'checked'}).css({opacity: mixed_opacity});
                    break;
            }
            
            $checkboxes.data('tristate', state_to_set);
            
        },
        _debug: function (message) {
            // Output any arguments to the console if available:
            window.console && console.debug.apply(console, arguments);
        }
    },
    states = {
        'checked': 'checked',
        'unchecked': 'unchecked',
        'mixed': 'mixed'
    },
    mixed_opacity = 0.5;
    
    $.fn.tristate = function (method) {
        if (self[method] && method.substr(0, 1) !== '_') {
            return self[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return self.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.tristate');
        }  
            
        
    };
})(jQuery);