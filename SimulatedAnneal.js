/*
* @Author: ryan
* @Date:   2016-09-18 18:21:23
* @Last Modified by:   Ryan Kophs
* @Last Modified time: 2016-09-19 18:42:06
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

window.SA = function(options){
    var max = Math.pow(2, 32);

    var init = function(options) {
        options = options || {};
        var saOps = options.sa || {};
        var prgOps = options.prg || {};

        this.t = saOps.t ||1.0;
        this.t_min = saOps.t_min || 0.0001;
        this.alpha = saOps.alpha || 0.9;
        this.k = saOps.k || 100;
        this.seed_m = prgOps.seed_m || Math.round(Math.random() * max);
        this.seed_c = prgOps.seed_c || Math.round(Math.random() * max);
        this.prg.init(this.seed_m, this.seed_c);

        this.history = [];
    };

    var render = function(self, s_prime) {
        if(self.render) {
            console.log("Rendering...");
            self.chart.plotPoints([s_prime], self.scale);
        }
    }

    var record = function(self, t, s, e, i) {
        self.history.push({
            t: t,
            s: s,
            e: e,
            i: i
        });
    }

    var getHistory = function() {
        return this.history;
    }

    var run = function(Neighbor, P, E, s_init) {
        var s = s_init;
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
        return {result: s, t_count: t_count};
    };

    if (this instanceof SA) {
        this.prg = new PRG();
        this.run = run;
        this.getHistory = getHistory;
        this.init = init;
        this.init(options);
    } else {
        return new SA(options);
    }
};