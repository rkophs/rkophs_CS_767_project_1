/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 18:22:12
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-22 20:38:40
*/

'use strict';

/*
* Use Simulated Annealing algorithm as a best effort to find the optimal
* inputs, x_1, x_2, x_3, that produce the minimal output for the
* following problem:
*   
*   f(x_1, x_2, x_3) = x_1^2 + x_2^2 + x_3^2 | x_1, x_2, x_3 \in [-10,10]
*
*
* General SA algorighm is implemented in SimulatedAnneal.js. This class
* simply represents the problem domain, and thus implements the 
* Neighbor, P, and E callback functions used by the SA algorithm along
* with a randomly chosen, initial state, sInit.
*
* A state, s, is defined as an array of [x_1, x_2, x_3]. Local neighbors 
* to a given state, s, are chosen by randomly altering a just one randomly 
* chosen dimension, x_i of the 3D state, s.
*
* @Params
*   options: Object representing each of the simulated annealing options 
*     and prg seed to be passed into the SimiluatedAnneal and PRG classes
*     described as such:
*		{
*			prg: {
*				seed: <int>,      -- pseudorandom generator seed
*			},
*			sa: {
*				t: <double>,      -- initial temperature
*				t_min: <double>,  -- temperature cooling limit
*				alpha: <double>,  -- rate of temperature cooling
*				k: <int>          -- number steps in SA heuristic
*				sweep: <int>      -- number of sweeps in a step
*			}
*		}
*/
window.MinSumOfSquares = function(options) {

	/*Private member variables containing pseudorandom number generator
	 * and general Simulated Annealing algorithm objects.
	 */
	var prg, sa;

	/* Used to initialize the problem domain, pseudorandom number 
	* generator and Simulated Annealing algorithm objects.
	*
	* @Params
	*   options: Object representing each of the simulated annealing
	*     options and prg seed as defined above.
	*/
	var init = function(options) {
		options = options || {};
		var seed = 4009412866;
		options.prg = options.prg || {seed: seed};

		prg = new PRG();
		prg.init(options.prg.seed);

		sa = new SA(options);
	};

	/*
	* Function that defines the problem for:
	*     f(x_1, x_2, x_3) = x_1^2 + x_2^2 + x_3^2
	*/
	var f = function(x1, x2, x3) {
		return x1*x1 + x2*x2 + x3*x3;
	};

	/*
	* Choose a pseudorandom value for x_i that is within
	* the problem domain of [-10, 10]
	*/
	var randomX = function() {
		return prg.random()*20 - 10;
	};

	/*
	* Pseudorandomly choose an integer of either 0, 1, or 2.
	*/
	var random012 = function() {
		return Math.floor(prg.random() * 3);
	}

	/*
	* Defines a functional callback used by the general SA algorithm
	* to generate a local neighbor state to the given input state.
	* Specifically, it randomly chooses one of the dimensions, x_i
	* of the input state, s, and updates that dimension with a 
	* randomly chosen value defined within the domain of [-10,10].
	*
	* @Params:
	*   s: Current state within the problem space as an array of
	*     [x_1, x_2, x_3]
	*/
	var Neighbor = function(s) {
		var s_prime = [s[0], s[1], s[2]];
		s_prime[random012()] = randomX();
		return s_prime;
	}

	/*
	* Defines a functional callback used by the general SA algorithm
	* to generate an acceptance probability that the new energy is
	* more optimal than the current enery for the given temperature.
	* Specifically, smaller energies are better than larger energies
	* as the SA algorithm temperature cools. The algorithm must
	* always generate a positive probability even if e_prime > e,
	* allowing for the change that a higher energy is chosen over
	* a previous lower energy. This is necessary so that local
	* minima may be exited to reach a global minimum.
	*
	* With regards to the this problem, if the new energy is less
	* than the current energy, return an acceptance probability of 1
	* so that the new energy and state are always accepted.
	* Otherwise, perform: E^((e - e_prime) / t).
	*
	* @Params:
	*   e: Current energy of the SA algorithm state.
	*   e_prime: Potential new energy of the SA algorithm new state.
	*   t: Current temperature of the ongoing SA algorithm.
	*/
	var P = function(e, e_prime, t) {
		if (e_prime < e) {
			return 1.0;
		}
		return Math.exp((e - e_prime)/t);
	}

	/* Defines a functional callback used by the general SA algorithm
	* to generate an energy of a given input state, s. The energy
	* here is defined by the problem defining function, f, and then
	* normalized to be within [0,1] (i.e. 10^2 + 10^2 + 10^2 = 300)
	*
	* @Params:
	*   s: Current state within the problem space as an array of
	*     [x_1, x_2, x_3]
	*/
	var E = function(s) {
		return f(s[0], s[1], s[2])/300;
	}

	/* 
	* Run the SA algorithm with respect to the problem domain at hand:
	*
	*    f(x_1, x_2, x_3) = x_1^2 + x_2^2 + x_3^2
	*
	* such that: 
	*
	*    x_1, x_2, x_3 \in [-10,10]
	*
	* Start by randomly generating an initial state, s_init, and
	* performing the SA algorithm defined in SimulatedAnneal.js
	* using the problem domain-specific Neighbor, P, and E 
	* callbacks and s_init.
	*
	* Executes a single run of the algorithm with multiple sweepts.
	*/
	var run = function() {
		var s_init = [randomX(), randomX(), randomX()];
		return sa.run(Neighbor, P, E, s_init);
	}

	/* Beginning of JS class constructor; if already instantiated: */
	if (this instanceof MinSumOfSquares) {
		this.init = init;
		this.run = run;
		this.init(options);
	} else {
		return new MinSumOfSquares(options);
	}
};