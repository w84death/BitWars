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
		console.log('analizeTerrain');
	},

	makeToDo: function(){
		console.log('makeToDo');
		// buy things
		this.toDo.buy.push({
			unit: 'helicopter',
			quanity: 1
		});
		this.toDo.buy.push({
			unit: 'tank',
			quanity: 1
		});
		this.toDo.buy.push({
			unit: 'soldier',
			quanity: 3
		});
		this.status.buying = true;
		
		this.toDo.move = {
			row: 1 + (Math.random()*(ig.game.map.blueprint.width-2))<<0,
			quanity: (Math.random()*4)<<0
		};
		this.status.moveing = true;


		// move terrain
	},

	runToDo: function(){
		console.log('runToDo');

		// lets go shoping after 20% time
		if(this.status.buying && this.timer.delta() > -0.8){
			for (var i = 0; i < this.toDo.buy.length; i++) {			
				for (var q = 0; q < this.toDo.buy[i].quanity; q++) {				
					ig.game.buyUnit({
						unit: this.toDo.buy[i].unit,
						team: this.team
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
			this.analizeTerrain();
			this.makeToDo();
		}

		if(this.status.thinking){					
			// do some boring calculations			
			this.runToDo();
		}
	}

});
});