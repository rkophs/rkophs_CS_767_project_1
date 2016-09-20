/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 18:22:12
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-20 12:03:42
*/

'use strict';

/*** Initialization options ***
{
	prg: {
		seed_m: <int>, 
		seed_c: <int>
	},
	sa: {
		t: <double>,
		t_min: <double>,
		alpha: <double>,
		k: <int>
	}
}
***/

window.MinSumOfSquares = function(options){
	var max = Math.pow(2, 32);
	var prg, sa;

	var init = function(options) {
		options = options || {};

		var m = 4009412866;
		var c = 3943122055;
		options.prg = options.prg || {seed_m: m, seed_c: c};

		prg = new PRG();
		prg.init(options.prg.seed_c, options.prg.seed_m);

		sa = new SA(options);
	};

	var f = function(x1, x2, x3) {
		return x1*x1 + x2*x2 + x3*x3;
	};

	var randomX = function() {
		return prg.random()*20 - 10;
	};

	var randomMod3 = function() {
		return Math.floor(prg.random() * 3);
	}

	var Neighbor = function(s) {
		var s_prime = [s[0], s[1], s[2]];
		s_prime[randomMod3()] = randomX();
		return s_prime;
	}

	var P = function(e, e_prime, t) {
		return Math.pow(Math.E, (e_prime - e)/t);
	}

	var E = function(s) {
		return 1/f(s[0], s[1], s[2]);
	}

	var run = function() {
		var s_init = [randomX(), randomX(), randomX()];
		return sa.run(Neighbor, P, E, s_init);
	}

	var getHistory = function() {
		return sa.getHistory();
	}

	if (this instanceof MinSumOfSquares) {
		this.init = init;
		this.run = run;
		this.getHistory = getHistory;
		this.init(options);
	} else {
		return new MinSumOfSquares(options);
	}
};