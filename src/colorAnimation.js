/**
* @name jQuery color animation plugin
* @version 1.0.1
* @author Minko Gechev
* @date 2012-01-17
*
* @license GPL
*
* @description
* jQuery color animation plugin.
*
* @usage
* $(selector).colorAnimation({ color: targetColor, property: CSSpropertyForAnimation, duration: animationDuration });
*/

(function ($) {
    'use strict';
    $.fn.colorAnimation = function (userOptions) {

        var element = this,
            options = {
                property: 'background-color',
                color: '#00ff00',
                duration: 300
            },
            sysVars = {
                rgbColor: {},
                rgbTargetColor: {},
                timeout: null,
                currentInterval: 0,
                animationStep: 10
            };

        $.extend(options, userOptions);

        function getFromHex(hex) {
            var rgb = {};
            if (hex.indexOf('#') >= 0) {
                hex = hex.substr(1, hex.length - 1);
            }
            if (hex.length === 3) {
                hex += hex;
            }
            rgb.red = { value: parseInt(hex.substr(0, 2), 16) };
            rgb.green = { value: parseInt(hex.substr(2, 2), 16) };
            rgb.blue = { value: parseInt(hex.substr(4, 2), 16) };
            return rgb;
        }

        function getFromRGB(rgb) {
            var returnValue = {};
            if (rgb.indexOf('rgba(') >= 0) {
                rgb = rgb.replace('rgba(', '');
            } else {
                rgb = rgb.replace('rgb(', '');
            }
            rgb = rgb.replace(')', '').replace(/ /g, '').split(',');
            returnValue.red = { value: parseInt(rgb[0], 10) };
            returnValue.green = { value: parseInt(rgb[1], 10) };
            returnValue.blue = { value: parseInt(rgb[2], 10) };
            return returnValue;
        }

        function getColor(color) {
            if (color.indexOf('#') >= 0) {
                return getFromHex(color);
            } else {
                return getFromRGB(color);
            }
        }

        function getHex(dec) {
            var hex = Math.round(dec).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            return hex;
        }

        function getHexColor(rgb) {
            var red = getHex(rgb.red.value),
                green = getHex(rgb.green.value),
                blue = getHex(rgb.blue.value);
            return '#' + red + green + blue;
        }

        function getSteps() {
            var duration = options.duration,
                rgb = sysVars.rgbColor,
                rgbTarget = sysVars.rgbTargetColor;
            rgb.red.step = 10 * (rgbTarget.red.value - rgb.red.value) / duration;
            rgb.green.step = 10 * (rgbTarget.green.value - rgb.green.value) / duration;
            rgb.blue.step = 10 * (rgbTarget.blue.value - rgb.blue.value) / duration;
        }

        function startAnimation(element) {
            var rgb = sysVars.rgbColor;
            sysVars.timeout = setTimeout(function () {
                if (sysVars.currentInterval >= options.duration) {
                    clearTimeout(sysVars.timeout);
                    return;
                }
                sysVars.currentInterval += sysVars.animationStep;
                rgb.red.value += rgb.red.step;
                rgb.green.value += rgb.green.step;
                rgb.blue.value += rgb.blue.step;
                element.css(options.property, getHexColor(rgb));
                startAnimation(element);
            }, sysVars.animationStep);
        }

        return (function (userOptions) {
            $.extend(options, userOptions);
            sysVars.rgbTargetColor = getColor(options.color);
            sysVars.rgbColor = getColor(element.css(options.property));
            getSteps();
            startAnimation(element);
        }());
    };
}(jQuery));