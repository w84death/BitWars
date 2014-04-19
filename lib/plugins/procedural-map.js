
ig.module(
    'plugins.procedural-map'
)
.requires(
    'impact.game'
)
.defines(function(){

ig.ProceduralMap = ig.Class.extend({
	
	terrain:			[],
	blueprint: {
		width: 			20,
		height: 		8,
		season: 		null,
		dna: {			
			trees: 		0,
			rocks: 		0,			
			bases: 		0,
		}
	},

 	init: function(){

 	},

    generate: function(params){    	    	
		
    	// set blueprint
		this.blueprint.width = params.prefs.width;
		this.blueprint.height = params.prefs.height;
		this.blueprint.season = params.prefs.season;
		this.blueprint.dna.trees = params.dna.trees;
		this.blueprint.dna.rocks = params.dna.rocks;
		this.blueprint.dna.bases = params.dna.bases;

		// init map
		for (var x = 0; x < this.blueprint.width; x++) {
            this.terrain[x] = [this.blueprint.height];
        }

        for (var x = 0; x < this.blueprint.width; x++) {
            for (var y = 0; y < this.blueprint.height; y++) {
               this.terrain[x][y] = 0;
            }
        }
    	
    	// build terrain

		var random = 0,
			newTile = false;

		for (var y = 0; y < this.blueprint.height; y++) {
            for (var x = 0; x < this.blueprint.width; x++) {
            	
            	newTile = false;

              if(x==0){
                  newTile = 3;
              }else
              if(x==this.blueprint.width-1){
                newTile = 4;              
              }else{              
                if(this.blueprint.dna.trees > Math.random() ){
                	newTile = 1;
                }else
                if(this.blueprint.dna.rocks > Math.random() ){
                	newTile = 2;
                }
              }

              if(newTile) this.terrain[x][y] = newTile;
               
            }
        }	
    	return true;
    },

    get: function(){
    	return {
    		terrain: this.terrain,
    		blueprint: this.blueprint
    	};
    }

});
});