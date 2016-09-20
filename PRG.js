/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 19:31:28
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-20 12:40:04
*/

'use strict';

/*
* A pseduo random generator using Complementary Multiply-With-Carry of lag 1. 
* It is necessary to use this rather than Math.Random(), because that is
* implemented differently in each browser, rending different results.
*
* Inspired by https://gist.github.com/Protonk/5367430 and similar to Chrome's
* V8 implementation
*
* Should be primed with a seed, defined by two integers:
*   m: Multiply-With-Carry m-seed
*   c: Multiply-With-Carry c-seed
*/
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