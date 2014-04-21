ig.module(
	'plugins.ai'
)
.requires(
	'impact.game'
)
.defines(function(){

ig.AI = ig.Class.extend({

	team: 		2,
	toDo: {
		buy: 	[],
		move: 	{}
	},	
	timer: 		new ig.Timer(),
	turnTime: 	1,
	status: 	{
		init: 		false,
		thinking: 	false,
		buying: 	false,
		moveing: 	false
	},

	init: function(){
		console.log('AI initialized.');		
	},

	analizeTerrain: function(){
		for (var x = 2; x < ig.game.map.blueprint.width-1; x++) {
			for (var y = 0; y < ig.game.map.blueprint.height; y++) {
				if(ig.game.map.units[x][y] && ig.game.map.units[x][y].team === ig.game.team){
					if(ig.game.map.terrain[x][y]){

					}
				}
			}
		};
	},

	makeToDo: function(){
		
		// buy things
		var r = (Math.random()*10)<<0;

		if(r < 3 && ig.game.teams[ig.game.team-1].bitcoins >= 6 && ig.game.turn > 5){
			this.toDo.buy.push({
				unit: 'helicopter',
				quanity: ((ig.game.teams[ig.game.team-1].bitcoins/6)<<0) + 1
			});
		}

		if(r < 5 || ig.game.turn < 3){
			this.toDo.buy.push({
				unit: 'soldier',
				quanity: (Math.random()*4)<<0
			});
		}

		if(r > 5){
			this.toDo.buy.push({
				unit: 'tank',
				quanity: ((ig.game.teams[ig.game.team-1].bitcoins/3)<<0) + 1
			});
		}

		this.status.buying = true;
		
		this.toDo.move = {
			row: 1 + (Math.random()*(ig.game.map.blueprint.width-2))<<0,
			quanity: (Math.random()*ig.game.teams[ig.game.team-1].moves)<<0
		};

		this.status.moveing = true;


		// move terrain

		//this.analizeTerrain();


	},

	runToDo: function(){
		// lets go shoping after 20% time
		if(this.status.buying && this.timer.delta() > -0.8){
			for (var i = 0; i < this.toDo.buy.length; i++) {			
				for (var q = 0; q < this.toDo.buy[i].quanity; q++) {				
					ig.game.buyUnit({
						unit: this.toDo.buy[i].unit,
						team: ig.game.team
					});	
				};
			};
			this.status.buying = false;
		}

		// if time 50% move the terrain

		if(this.status.moveing && this.timer.delta() > -0.5){						
			ig.game.moveRuler({
				setRow:this.toDo.move.row,						
			});	
		}

		if(this.status.moveing && this.timer.delta() > -0.3){			
			
			for (var y = 0; y < this.toDo.move.quanity; y++) {									
				ig.game.moveRuler({
					up:true
				});				
			};
			this.status.moveing = false;
		}

		// 80% time = done
		if(this.timer.delta() > -0.2){
			this.status.thinking = false;
		}
	},

	unlock: function(){
		this.status.thinking = true;
		this.status.init = false;		
	},

	think: function(params){
		if(!this.status.init){
			// set timer
			this.timer.set(this.turnTime);
			this.status.init = true;
			this.makeToDo();			
		}

		if(this.status.thinking){					
			// do some boring calculations			
			this.runToDo();
		}
	}

});
});