/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 19:31:28
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-22 20:33:49
*/

'use strict';

window.PRG = function() {

    var mwc = (function() {
        var gen;

        return {
            init: function(seed) {
                gen = new MersenneTwister(seed);
            },
            random: function() {
                return gen.random();
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