/*
gamepad.js, See README for copyright and usage instructions.
}
*/
ig.module(
	'plugins.gamepad'
)
.requires(
)
.defines(function() {

    var getField = function() {
        try
        {
            return navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads
            || navigator.webkitGetGamepads() || navigator.mozGetGamepads() || navigator.getGamepads();
        }
        catch (e)
        {
            return {};
        }
    };

    var Item = function() {
        this.leftStickX = 0.0;
        this.leftStickY = 0.0;
        this.rightStickX = 0.0;
        this.rightStickY = 0.0;
        this.faceButton0 = 0.0;
        this.faceButton1 = 0.0;
        this.faceButton2 = 0.0;
        this.faceButton3 = 0.0;
        this.leftShoulder0 = 0.0;
        this.rightShoulder0 = 0.0;
        this.leftShoulder1 = 0.0;
        this.rightShoulder1 = 0.0;
        this.select = 0.0;
        this.start = 0.0;
        this.leftStickButton = 0.0;
        this.rightStickButton = 0.0;
        this.dpadUp = 0.0;
        this.dpadDown = 0.0;
        this.dpadLeft = 0.0;
        this.dpadRight = 0.0;
        this.deadZoneLeftStick = 0.25;
        this.deadZoneRightStick = 0.25;
        this.deadZoneShoulder0 = 0.0;
        this.deadZoneShoulder1 = 0.0;
        this.images = Gamepad.ImageDataUrls_Unknown;
        this.name = "Unknown";
    };

    var deepCopy = function(into, from) {
        into.leftStickX = from.leftStickX;
        into.leftStickY = from.leftStickY;
        into.rightStickX = from.rightStickX;
        into.rightStickY = from.rightStickY;
        into.faceButton0 = from.faceButton0;
        into.faceButton1 = from.faceButton1;
        into.faceButton2 = from.faceButton2;
        into.faceButton3 = from.faceButton3;
        into.leftShoulder0 = from.leftShoulder0;
        into.rightShoulder0 = from.rightShoulder0;
        into.leftShoulder1 = from.leftShoulder1;
        into.rightShoulder1 = from.rightShoulder1;
        into.select = from.select;
        into.start = from.start;
        into.leftStickButton = from.leftStickButton;
        into.rightStickButton = from.rightStickButton;
        into.dpadUp = from.dpadUp;
        into.dpadDown = from.dpadDown;
        into.dpadLeft = from.dpadLeft;
        into.dpadRight = from.dpadRight;
    };

    var contains = function(lookIn, forWhat) { return lookIn.indexOf(forWhat) != -1; };
    var userAgent = navigator.userAgent;
    var isWindows = contains(userAgent, 'Windows NT');
    var isMac = contains(userAgent, 'Macintosh');
    var isLinux = contains(userAgent, 'Linux');
    var isChrome = contains(userAgent, 'Chrome/');
    var isFirefox = contains(userAgent, 'Firefox/');

    var axisToButton = function(value) {
        return (value + 1.0) / 2.0;
    }

    if (isFirefox) {
        // todo; current moz nightly does not define this, so we'll always
        // return true for .supported on that Firefox.
        navigator.mozGamepads = [];
        var mozConnectHandler = function(e) {
            navigator.mozGamepads[e.gamepad.index] = e.gamepad;
        }
        var mozDisconnectHandler = function(e) {
            navigator.mozGamepads[e.gamepad.index] = undefined;
        }
        window.addEventListener("MozGamepadConnected", mozConnectHandler);
        window.addEventListener("MozGamepadDisconnected", mozDisconnectHandler);
    }

    var mapPad = function(raw, mapped) {
        var len = active.length;
        for (var i = 0; i < len; ++i)
        {
            var entry = active[i];
            if (typeof(entry) == "undefined") return;
            var ss1 = entry[0];
            var ss2 = entry[1];
            if (contains(raw.id, ss1) && contains(raw.id, ss2)) {
                var handler = entry[2];
                handler(raw, mapped);
                var deviceident = entry[3];
                mapped.name = deviceident + " Player " + (raw.index + 1);
                // todo; apply dead zones to mapped here
                return;
            }
        }
        var entry = active[0];
        if (typeof(entry) == "undefined") return;
        var handler = entry[2];
        handler(raw, mapped);
        var deviceident = entry[3];
        mapped.name = deviceident + " Player " + (raw.index + 1);
    };

    var mapIndividualPad = function(rawPads, i) {
        var raw = rawPads[i];
        if (!raw) {
            prevData[i] = undefined;
            curData[i] = undefined;
            return;
        }
        if (curData[i] === undefined) {
            prevData[i] = new Item();
            curData[i] = new Item();
        }
        deepCopy(prevData[i], curData[i]);
        mapPad(raw, curData[i]);
    };

    var prevData = [];
    var curData = [];
    var Gamepad = {};
    window.Gamepad = Gamepad;
    Gamepad.getPreviousStates = function() {
        return prevData;
    };
    Gamepad.mappings = Gamepad.mappings ||
    {
        one: [],
        two: [],
        three: [],
        four: [],
        active: true
    };
    Gamepad.getStates = function() {
        var rawPads = getField()
        var len = rawPads.length;
        for (var i = 0; i < len; ++i) {
            mapIndividualPad(rawPads, i);
        }
        for (; i < curData.length; ++i) {
            prevData[i] = undefined;
            curData[i] = undefined;
        }
        return curData;
    };
    Gamepad.getPreviousState = function(i) {
        return prevData[i];
    };
    Gamepad.getState = function(i) {
        var rawPads = getField();
        mapIndividualPad(rawPads, i);
        return curData[i];
    };
    Gamepad.supported = getField() != undefined;


    // todo; These sort of seems like it could be data, but there's actually a
    // lot of exceptions, and it might be slower to map per frame anyway (we
    // want one of these methods to be hot for each connected device). Revisit
    // once we have more pads accounted for to see if there's consistent
    // patterns.

    var ChromeWindowsXinputGamepad = function(raw, into, index) {
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[3];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.leftShoulder1 = raw.buttons[6];
        into.rightShoulder1 = raw.buttons[7];
        into.select = raw.buttons[8];
        into.start = raw.buttons[9];
        into.leftStickButton = raw.buttons[10];
        into.rightStickButton = raw.buttons[11];
        into.dpadUp = raw.buttons[12];
        into.dpadDown = raw.buttons[13];
        into.dpadLeft = raw.buttons[14];
        into.dpadRight = raw.buttons[15];
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
    };

    var FirefoxWindowsXbox360Controller = function(raw, into, index) {
        // Wow, dinput is a disaster.
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[3];
        into.rightStickY = raw.axes[4];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.leftShoulder1 = raw.axes[2] > 0 ? raw.axes[2] : 0;
        into.rightShoulder1 = raw.axes[2] < 0 ? -raw.axes[2] : 0;
        into.select = raw.buttons[6];
        into.start = raw.buttons[7];
        into.leftStickButton = raw.buttons[8];
        into.rightStickButton = raw.buttons[9];
        into.dpadUp = raw.axes[6] < -0.5 ? 1 : 0;
        into.dpadDown = raw.axes[6] > 0.5 ? 1 : 0;
        into.dpadLeft = raw.axes[5] < -0.5 ? 1 : 0;
        into.dpadRight = raw.axes[5] > 0.5 ? 1 : 0;
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
    }

    var CommonMacXbox360Controller = function(raw, into, index) {
        // NOTE: Partial, doesn't set all values.
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.select = raw.buttons[9];
        into.start = raw.buttons[8];
        into.leftStickButton = raw.buttons[6];
        into.rightStickButton = raw.buttons[7];
        into.dpadUp = raw.buttons[11];
        into.dpadDown = raw.buttons[12];
        into.dpadLeft = raw.buttons[13];
        into.dpadRight = raw.buttons[14];
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
    }

    var ChromeMacXbox360Controller = function(raw, into, index) {
        CommonMacXbox360Controller(raw, into, index);
        into.rightStickX = raw.axes[3];
        into.rightStickY = raw.axes[4];
        into.leftShoulder1 = axisToButton(raw.axes[2]);
        into.rightShoulder1 = axisToButton(raw.axes[5]);
    };

    var ChromeMacLogitechF310Controller = function(raw, into, index) {
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.faceButton0 = raw.buttons[1];
        into.faceButton1 = raw.buttons[2];
        into.faceButton2 = raw.buttons[0];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.select = raw.buttons[8];
        into.start = raw.buttons[9];
        into.leftStickButton = raw.buttons[10];
        into.rightStickButton = raw.buttons[11];

        // There is a switch to toggle the left joystick and dpad
        // only one is enabled at a time and the output always goes
        // through the left joystick
        into.dpadUp =  0;
        into.dpadDown = 0;
        into.dpadLeft = 0;
        into.dpadRight = 0;

        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
        console.log(raw.axes);
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[5];
        into.leftShoulder1 = raw.buttons[6];
        into.rightShoulder1 = raw.buttons[7];
    };

    var FirefoxMacXbox360Controller = function(raw, into, index) {
        CommonMacXbox360Controller(raw, into, index);
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[3];
        into.leftShoulder1 = axisToButton(raw.axes[4]);
        into.rightShoulder1 = axisToButton(raw.axes[5]);
    };

    var CommonMacPS3Controller = function(Raw, into, index) {
        // NOTE: Partial, doesn't set all values.
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[2];
        into.faceButton0 = raw.buttons[14];
        into.faceButton1 = raw.buttons[13];
        into.faceButton2 = raw.buttons[15];
        into.faceButton3 = raw.buttons[12];
        into.leftShoulder0 = raw.buttons[10];
        into.rightShoulder0 = raw.buttons[11];
        into.leftShoulder1 = raw.buttons[8];
        into.rightShoulder1 = raw.buttons[9];
        into.select = raw.buttons[0];
        into.start = raw.buttons[3];
        into.leftStickButton = raw.buttons[1];
        into.rightStickButton = raw.buttons[2];
        into.dpadUp = raw.buttons[4];
        into.dpadDown = raw.buttons[6];
        into.dpadLeft = raw.buttons[7];
        into.dpadRight = raw.buttons[5];
    };

    var FirefoxMacPS3Controller = function(raw, into, index) {
        CommonMacPS3Controller(raw, into, index);
        into.rightStickY = raw.axes[3];
    };

    var ChromeMacPS3Controller = function(raw, into, index) {
        into.rightStickY = raw.axes[5];
    };

    var ChromeGenericController = function(raw, into, index) {
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.rightStickX = raw.axes[3];
        into.rightStickY = raw.axes[2];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.leftShoulder1 = raw.buttons[7];
        into.rightShoulder1 = raw.buttons[6];
        into.select = raw.buttons[8];
        into.start = raw.buttons[9];
        into.leftStickButton = raw.buttons[10];
        into.rightStickButton = raw.buttons[11];
        into.dpadUp = raw.axes[5] < -0.5 ? 1 : 0;
        into.dpadDown = raw.axes[5] > 0.5 ? 1 : 0;
        into.dpadLeft = raw.axes[4] < -0.5 ? 1 : 0;
        into.dpadRight = raw.axes[4] > 0.5 ? 1 : 0;
        // From http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
    };

    var CommonLinuxXbox360Controller = function(raw, into, index) {
        // copied from Mac not updated yet.
        // NOTE: Partial, doesn't set all values.
        into.leftStickX = raw.axes[0];
        into.leftStickY = raw.axes[1];
        into.faceButton0 = raw.buttons[0];
        into.faceButton1 = raw.buttons[1];
        into.faceButton2 = raw.buttons[2];
        into.faceButton3 = raw.buttons[3];
        into.leftShoulder0 = raw.buttons[4];
        into.rightShoulder0 = raw.buttons[5];
        into.select = raw.buttons[8];
        into.start = raw.buttons[9];
        into.leftStickButton = raw.buttons[10];
        into.rightStickButton = raw.buttons[11];
        into.dpadUp = raw.buttons[12];
        into.dpadDown = raw.buttons[13];
        into.dpadLeft = raw.buttons[14];
        into.dpadRight = raw.buttons[15];
        into.deadZoneLeftStick = 7849.0/32767.0;
        into.deadZoneRightStick = 8689.0/32767.0;
        into.deadZoneShoulder0 = 0.5;
        into.deadZoneShoulder1 = 30.0/255.0;
    }
    var ChromeLinuxXbox360Controller = function(raw, into, index) {
        CommonLinuxXbox360Controller(raw, into, index);
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[3];
        into.leftShoulder1 = raw.buttons[6];
        into.rightShoulder1 = raw.buttons[7];
    };
    var FirefoxLinuxXbox360Controller = function(raw, into, index) {
        CommonLinuxXbox360Controller(raw, into, index);
        into.rightStickX = raw.axes[2];
        into.rightStickY = raw.axes[3];
        into.leftShoulder1 = axisToButton(raw.axes[4]);
        into.rightShoulder1 = axisToButton(raw.axes[5]);
    };


    var active = [];
    // todo; possible we need to add different deadzones based on controller
    //       manufacturer, but perhaps they're fairly close anyway.
    if (isChrome && isWindows) {
        active.push([ 'Vendor: Unknown', 'Product: Unknown', ChromeGenericController, "Generic Controller" ]);
        active.push([ 'XInput ', 'GAMEPAD', ChromeWindowsXinputGamepad, "Xbox 360" ]);
    } else if (isChrome && isMac) {
        active.push([ 'Vendor: Unknown', 'Product: Unknown', ChromeGenericController, "Generic Controller" ]);
        active.push([ 'Vendor: 045e', 'Product: 028e', ChromeMacXbox360Controller, "Xbox 360" ]);
        active.push([ 'Vendor: 045e', 'Product: 02a1', ChromeMacXbox360Controller, "Xbox 360" ]);
        active.push([ 'Vendor: 054c', 'Product: 0268', ChromeMacPS3Controller, "Playstation 3" ]);
        active.push([ 'Vendor: 046d', 'Product: c216', ChromeMacLogitechF310Controller, "Logitech F310" ]);
    } else if (isFirefox && isWindows) {
        active.push([ 'Vendor: Unknown', 'Product: Unknown', ChromeGenericController, "Generic Controller" ]);
        active.push([ '45e-', '28e-', FirefoxWindowsXbox360Controller, "Xbox 360" ]);
        active.push([ '45e-', '2a1-', FirefoxWindowsXbox360Controller, "Xbox 360" ]);
        active.push([ '46d-', 'c21d-', FirefoxWindowsXbox360Controller, "Logitech F310" ]);
        active.push([ '46d-', 'c21e-', FirefoxWindowsXbox360Controller, "Logitech F510" ]);
    } else if (isFirefox && isMac) {
        active.push([ 'Vendor: Unknown', 'Product: Unknown', ChromeGenericController, "Generic Controller" ]);
        active.push([ '45e-', '28e-', FirefoxMacXbox360Controller, "Xbox 360" ]);
        active.push([ '54c-', '268-', FirefoxMacPS3Controller, "Playstation 3" ]);
    } else if (isChrome && isLinux) {
        console.log('Linux - Chrome');
        active.push([ 'Vendor: 045e', 'Product: 028e', ChromeLinuxXbox360Controller, "Xbox 360"]);
    } else if (isFirefox && isLinux) {
        console.log('Linux - Firefox');
        active.push([ '45e-', '28e-', FirefoxLinuxXbox360Controller, "Xbox 360" ]);
    }


    var activeButtonActions = [];
    var activeAxisActions = [];
    Gamepad.handleInput = function()
    {
        if (Gamepad.mappings.active == false) return;
        var gamepads = Gamepad.getStates();

        for (var n = 0; n < gamepads.length; n++)
        {
            pad = gamepads[n];
            var mappings;
            switch (n)
            {
                case 0:
                    mappings = Gamepad.mappings.one;
                    break;
                case 1:
                    mappings = Gamepad.mappings.two;
                    break;
                case 2:
                    mappings = Gamepad.mappings.three;
                    break;
                case 3:
                    mappings = Gamepad.mappings.four;
                    break;
            }

            if (typeof(pad) == "undefined" || typeof(mappings) == "undefined") continue;

            for(m=0; m < mappings.length; m++)
            {
                if (typeof(mappings[m][2]) == "undefined") // if no second action, it's a button
                {
                    bindButtonToAction(pad[mappings[m][0]], mappings[m][1]);
                }
            }
            for(m=0; m < mappings.length; m++)
            {
                if (typeof(mappings[m][2]) != "undefined") // if two actions, it's an axis
                {
                    bindAxisToAction(pad[mappings[m][0]], mappings[m][1], mappings[m][2]);
                }
            }
        }
    }

    bindButtonToAction = function(myButton, action)
    {
        if (activeButtonActions[action] && myButton == 0 && !ig.input.pressed(action))
        {
            if (!activeAxisActions[action])
            {
                ig.input.delayedKeyup[action] = true;
            }
            activeButtonActions[action] = false;
        }
        else if (myButton == 1)
        {
            ig.input.actions[action] = true;
            if( !ig.input.locks[action])
            {
                ig.input.presses[action] = true;
                ig.input.locks[action] = true;
                activeButtonActions[action] = true;
            }
        }
    }

    bindAxisToAction = function(myAxis, negativeAction, positiveAction)
    {
        if (activeAxisActions[negativeAction] && myAxis >= -0.7 && !ig.input.pressed(negativeAction))
        {
            if (!activeButtonActions[negativeAction])
            {
                ig.input.delayedKeyup[negativeAction] = true;
            }
            activeAxisActions[negativeAction] = false;
        }
        else if (myAxis < -0.7)
        {
            ig.input.actions[negativeAction] = true;
            if( !ig.input.locks[negativeAction] )
            {
                ig.input.presses[negativeAction] = true;
                ig.input.locks[negativeAction] = true;
            }
            activeAxisActions[negativeAction] = true;
        }

        if (activeAxisActions[positiveAction] && myAxis <= 0.7 && !ig.input.pressed(positiveAction))
        {
            if (!activeButtonActions[positiveAction])
            {
                ig.input.delayedKeyup[positiveAction] = true;
            }
            activeAxisActions[positiveAction] = false;
        }
        else if (myAxis > 0.7)
        {
            ig.input.actions[positiveAction] = true;
            if( !ig.input.locks[positiveAction] )
            {
                ig.input.presses[positiveAction] = true;
                ig.input.locks[positiveAction] = true;
                activeAxisActions[positiveAction] = true;
            }
        }
    }
});
