ig.module(
    'plugins.gamepad'
)
.requires(
    'impact.input',
    'impact.game'
)
.defines(function(){

// Assign some values to the Gamepad buttons. We use an offset of 256
// here so we don't collide with the keyboard buttons when binding.
ig.GAMEPAD_BUTTON_OFFSET = 256;
ig.GAMEPAD = {
    FACE_1: ig.GAMEPAD_BUTTON_OFFSET + 0,
    FACE_2: ig.GAMEPAD_BUTTON_OFFSET + 1,
    FACE_3: ig.GAMEPAD_BUTTON_OFFSET + 2,
    FACE_4: ig.GAMEPAD_BUTTON_OFFSET + 3,
    LEFT_SHOULDER: ig.GAMEPAD_BUTTON_OFFSET + 4,
    RIGHT_SHOULDER: ig.GAMEPAD_BUTTON_OFFSET + 5,
    LEFT_SHOULDER_BOTTOM: ig.GAMEPAD_BUTTON_OFFSET + 6,
    RIGHT_SHOULDER_BOTTOM: ig.GAMEPAD_BUTTON_OFFSET + 7,
    SELECT: ig.GAMEPAD_BUTTON_OFFSET + 8,
    START: ig.GAMEPAD_BUTTON_OFFSET + 9,
    LEFT_ANALOGUE_STICK: ig.GAMEPAD_BUTTON_OFFSET + 10,
    RIGHT_ANALOGUE_STICK: ig.GAMEPAD_BUTTON_OFFSET + 11,
    PAD_TOP: ig.GAMEPAD_BUTTON_OFFSET + 12,
    PAD_BOTTOM: ig.GAMEPAD_BUTTON_OFFSET + 13,
    PAD_LEFT: ig.GAMEPAD_BUTTON_OFFSET + 14,
    PAD_RIGHT: ig.GAMEPAD_BUTTON_OFFSET + 15,
    OUYA: ig.GAMEPAD_BUTTON_OFFSET + 16,
    A_LEFT: ig.GAMEPAD_BUTTON_OFFSET + 17,
    A_RIGHT: ig.GAMEPAD_BUTTON_OFFSET + 18,
    A_UP: ig.GAMEPAD_BUTTON_OFFSET + 19,
    A_DOWN: ig.GAMEPAD_BUTTON_OFFSET + 20
};


ig.normalizeVendorAttribute(navigator, 'getGamepads');

if( !navigator.getGamepads ) {
    // No Gamepad support; nothing to do here
    return;
}

ig.Input.inject({
    gamepad: null,
    lastButtons: [],
    treshold: 0.7,
    hasButtonObject: !!window.GamepadButton,

    getFirstGamepadSnapshot: function() {
        var gamepads = navigator.getGamepads();
        for( var i = 0; i < gamepads.length; i++ ) {
            if( gamepads[i] ) {
                return gamepads[i];
            }
        }
        return null;
    },

    pollGamepad: function() {
        this.gamepad = this.getFirstGamepadSnapshot();
        if( !this.gamepad ) {
            // No gamepad snapshot?
            return;
        }

        // Iterate over all buttons, see if they're bound and check
        // for their state
        for( var button = 0; button < this.gamepad.buttons.length; button++ ) {
            var action = this.bindings[button+ig.GAMEPAD_BUTTON_OFFSET];

            // Is the button bound to an action?
            if( action ) {
                currentState = this.hasButtonObject
                    ? this.gamepad.buttons[button].pressed // W3C Standard
                    : this.gamepad.buttons[button]; // Current Chrome version

                var prevState = this.lastButtons[button];

                // Was not pressed, but is now?
                if( !prevState && currentState ) {
                    this.actions[action] = true;
                    this.presses[action] = true;

                }
                // Was pressed, but is no more?
                else if( prevState && !currentState ) {
                    this.delayedKeyup[action] = true;
                }
            }

            this.lastButtons[button] = currentState;
        }

        var bind = this.bindings[ig.GAMEPAD_BUTTON_OFFSET + 17];
        if(this.gamepad.axes[0] < -this.treshold ){
            this.actions[bind] = true;
            this.presses[bind] = true;
        }else{
            this.delayedKeyup[bind] = true;
        }
        bind = this.bindings[ig.GAMEPAD_BUTTON_OFFSET + 18];
        if(this.gamepad.axes[0] > this.treshold ){
            this.actions[bind] = true;
            this.presses[bind] = true;
        }else{
            this.delayedKeyup[bind] = true;
        }
        bind = this.bindings[ig.GAMEPAD_BUTTON_OFFSET + 19];
        if(this.gamepad.axes[1] < -this.treshold ){
            this.actions[bind] = true;
            this.presses[bind] = true;
        }else{
            this.delayedKeyup[bind] = true;
        }
        bind = this.bindings[ig.GAMEPAD_BUTTON_OFFSET + 20];
        if(this.gamepad.axes[1] > this.treshold ){
            this.actions[bind] = true;
            this.presses[bind] = true;
        }else{
            this.delayedKeyup[bind] = true;
        }


    }
});

// Always poll gamepad before each frame
ig.Game.inject({
    run: function() {
        ig.input.pollGamepad();
        this.parent();
    }
})

});