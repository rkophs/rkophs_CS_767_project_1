/*
* @Author: Ryan Kophs
* @Date:   2016-09-18 18:21:23
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-20 16:13:15
*/

'use strict';

/*
* General Simulated Annealing algorithm implementation to be used on any
*   arbitrary problem domain space. Algorithm follows the structure and
*   format descripted in https://en.wikipedia.org/wiki/Simulated_annealing
*
* Specifically, contains a run(Neighbor, P, E, sInit) function which
*   incrementally decreases a temperature, t, by a defined amount, alpha,
*   until the temperature reaches a defined limit, t_min. During each
*   iteration, k steps are performed. During each step: 
*      1. Parameterized Neighbor callback function is used to generate a 
*         new state, s_prime, which is said to be a randomly chosen local 
*         neighbor to the current state, s.
*      2. Then, an energy, e_prime of the new s_prime is generated 
*         by calling the parameterized E callback function.
*      3. Then, an acceptance probability is generated by calling the
*         parameterized P callback function. If that probability is
*         greator than a seperate, randomly-chosen probability, the
*         current state, s, is assigned the new state, s_prime.
*   After temperature, t, as reached its limit, t_min, run() returns
*   the final state, s, and number of temperature reductions, t_count.
* 
* @Params
*   options: Object representing each of the simulated annealing options 
*     and prg seed as such:
*		{
*			prg: {
*				seed_m: <int>,    -- Multiply-With-Carry m-seed
*				seed_c: <int>     -- Multiply-With-Carry c-seed
*			},
*			sa: {
*				t: <double>,      -- initial temperature
*				t_min: <double>,  -- temperature cooling limit
*				alpha: <double>,  -- rate of temperature cooling
*				k: <int>          -- number steps in SA heuristic
*			}
*		}
*/
window.SA = function(options){

	/* 
	* Initialize simulated annealing options and PRG seed. In the case
	*   that an option isn't parameterized, it is set to a default.
	* @Params:
	*   options: Object representing each of the simulated annealing
	*     options and prg seed as defined above.
	*/
	var init = function(options) {
		options = options || {};
		var saOps = options.sa || {};
		var prgOps = options.prg || {};

		this.t = saOps.t ||1.0;
		this.t_min = saOps.t_min || 0.0001;
		this.alpha = saOps.alpha || 0.9;
		this.k = saOps.k || 100;
		this.seed_m = prgOps.seed_m || 4009412866;
		this.seed_c = prgOps.seed_c || 3943122055;
		this.prg.init(this.seed_m, this.seed_c);

		this.history = [];
	};

	/*
	* Used to save a history of all local-best states witnessed 
	*   thoughout each heuristic of each temperature cooling phase.
	* @Params:
	*   self: this JS object (what a dirty language, JS is!)
	*   t: current temperature
	*   s: current state
	*   e: current energy of current state
	*   i: current step of the heuristic algorithm
	*/
	var record = function(self, t, s, e, i) {
		self.history.push({
			t: t,
			s: s,
			e: e,
			i: i
		});
	}

	/*
	* Performs the SA algorithm as defined in the description above.
	* @Params:
	*   Neighbor: function callback used to generate a randomly-chosen
	*     local neighbor within the problem domain. This function
	*     accepts a single param, s, for current state.
	*   P: function callback used to generate an acceptance probability
	*     of a given energy with respect to the current energy and
	*     temperature. This function accepts current energy, e, new
	*     energy, e_prime, and current temperature, t.
	*   E: function callback used to generate the energy of a given
	*     state. This function accepts one param, s, corresponding to a
	*     state.
	*   sInit: Initial state of the problem domain before the algorithm
	*     is performed. This should be randomly chosen.
	*/
	var run = function(Neighbor, P, E, sInit) {
		var s = sInit;
		var e = E(s);
		var t = this.t;
		var t_min = this.t_min;
		var alpha = this.alpha;
		var k = this.k;

		var t_count = 0;
		while(t > t_min){
			var i;
			for(i = 0; i <= k; i++){
				var s_prime = Neighbor(s);
				var e_prime = E(s_prime);
				var p = P(e, e_prime, t);
				if(p > this.prg.random()){
					record(this, t, s_prime, e_prime, i);
					s = s_prime;
					e = e_prime;
				}
			}
			t *= alpha;
			t_count++;
		}
		return {result: s, e: e, t_count: t_count, history: this.history};
	};

	/* Beginning of JS class constructor; if already instantiated: */
	if (this instanceof SA) {
		this.prg = new PRG();
		this.run = run;
		this.init = init;
		this.init(options);
	} else {
		return new SA(options);
	}
};