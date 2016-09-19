/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 19:31:28
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-19 17:31:25
*
* Complementary Multiply-With-Carry of lag 1. Similar to Chrome's V8 Math.random implementation.
* Inspired by https://gist.github.com/Protonk/5367430 
*/

'use strict';

window.PRG = function() {

	var mwc = (function() {
		var max = Math.pow(2, 32);
        var a = 3636507990;
        var m = 4009412866;
    	var c = 3943122055;
        return {
            init : function(carry, multiplier) {
                c = carry
                m = multiplier
            },
            random : function() {
                c = ((a*m)+c)/max;
                m = (max-1)-((a*m)+c)%max;
                return m/max;
            }
        };
	}());

	if (this instanceof PRG) {
		this.init = mwc.init;
		this.random = mwc.random;
	} else {
		return new PRG();
	}
};