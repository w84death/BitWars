
ig.module(
	'plugins.procedural-map'
)
.requires(
	'impact.game'
)
.defines(function(){

ig.ProceduralMap = ig.Class.extend({

terrain:			[],
	units:              [],
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
			this.units[x] = [this.blueprint.height];
		}

		for (var x = 0; x < this.blueprint.width; x++) {
			for (var y = 0; y < this.blueprint.height; y++) {
				this.terrain[x][y] = {};
				this.terrain[x][y].type = 0;
				this.units[x][y] = false;
			}
		}
			
			// build terrain

		var random = 0,
			newTile = false,
			empty = [];


		for (var x = 0; x < this.blueprint.width; x++) {
			for (var y = 0; y < this.blueprint.height; y++) {
				
				newTile = false;

				if(x==0){
					// GRASS LEFT
					newTile = 3;
				}else
				if(x==this.blueprint.width-1){
					// GRASS RIGHT
					newTile = 4;              
				}else{              
					if(this.blueprint.dna.trees > Math.random() ){
						// TREE
						newTile = 1;
					}else
					if(this.blueprint.dna.rocks > Math.random() ){
						// ROCK
						newTile = 2;
					}
				}

				// COLLECT EMPTY FIELDS
				if(x>2 && x<this.blueprint.width-3){
					if(!newTile) empty.push({x:x,y:y})
				}

				// SAVE NEW TILE
				if(newTile) this.terrain[x][y].type = newTile;
				 
			}
		}

		// BASES
		// do we have enough free space?
		if(this.blueprint.dna.bases > empty.length) this.blueprint.dna.bases = empty.length;

		// add them!
		for (var i = 0; i < this.blueprint.dna.bases; i++) {
			var r = (Math.random()*empty.length)<<0;
			this.terrain[empty[r].x][empty[r].y].type = 5;
			this.terrain[empty[r].x][empty[r].y].base = true;
		};

		return true;
	},

	get: function(){
		return {
			terrain: this.terrain,
			units: this.units,
			blueprint: this.blueprint
		};
	}

});
});