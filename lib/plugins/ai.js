ig.module(
	'plugins.ai'
)
.requires(
	'impact.game'
)
.defines(function(){

ig.AI = ig.Class.extend({

	team: 		1,
	toDo: {
		buy: 	[],
		move: 	[]
	},	
	timer: 		new ig.Timer(),
	turnTime: 	1,
	status: 	{
		init: 		false,
		thinking: 	false,
		buying: 	false,
		moveing: 	false
	},
	stats: {
		ownUnits: {
		 	soldier: 	0,
			tank: 		0,
			helicopter: 0,
			all: 		0
		},
		enemyUnits: {
			soldier: 	0,
			tank: 		0,
			helicopter: 0,
			all: 		0
		},
		ownBases: 	0,
		enemyBases: 0
	},

	init: function(){
		console.log('AI initialized. Now will conquer the world!');
	},

	analizeTerrain: function(){
		var unit, enemy, dir;

		this.stats.ownUnits.soldier = 0;
		this.stats.ownUnits.tank = 0;
		this.stats.ownUnits.helicopter = 0;
		this.stats.ownUnits.all = 0;

		this.stats.enemyUnits.soldier = 0;
		this.stats.enemyUnits.tank = 0;
		this.stats.enemyUnits.helicopter = 0;
		this.stats.enemyUnits.all = 0;

		dir = (ig.game.team === 1 ? 1 : -1 );

		// make stats and decite with colum to move
		for (var x = 0; x < ig.game.map.blueprint.width; x++) {
			for (var y = 0; y < ig.game.map.blueprint.height; y++) {
				unit = ig.game.getEntityByName(ig.game.map.units[x][y]);
				if(unit && unit.team === ig.game.team){
					if(unit.base){
						// its our own base
						this.stats.ownBases += 1;
					}else
					// don't count the flags
					if(!unit.flag){
						// STATS						
						if(unit.soldier) this.stats.ownUnits.soldier += 1;
						if(unit.tank) this.stats.ownUnits.tank += 1;
						if(unit.helicopter) this.stats.ownUnits.helicopter += 1;
						this.stats.ownUnits.all += 1

						// TERRAIN
						// if there's an powerfull enamy try to move out
						enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y]);
						if(enemy && ( enemy.power >= unit.power || enemy.flag )){
							this.toDo.move.push({
								row: x,
								quanity: 1,
								down: true
							});
							this.status.moveing = true;
						}

						
						// search for base
						
						// top base
						if(y > 0){
							enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y-1]);
						}else{
							enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][ig.game.map.blueprint.height-1]);
						}
						
						if(enemy && enemy.base){
							this.toDo.move.push({
								row: x+dir,
								down: true,
								quanity: 1
							});
							this.status.moveing = true;
						}

						// bottom base
						enemy = false;

						if(y < ig.game.map.blueprint.height-1){
							enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y+1]);
						}else{
							enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][0]);
						}
						
						if(enemy && enemy.base){
							this.toDo.move.push({
								row: x+dir,
								top: true,
								quanity: 1
							});
							this.status.moveing = true;
						}

						enemy = false;

						// it's unit an we need to check if he has a clear path forward
						if((ig.game.map.terrain[x+dir][y].type > unit.terrain && ig.game.map.terrain[x+dir][y].type < 3 ) || (ig.game.map.terrain[x+dir][y].type >= unit.terrain && unit.power > 1)){							
							this.toDo.move.push({
								row: x+dir,
								quanity: 1,
								top:true
							});
							this.status.moveing = true;
						}

						
					}					
				}
				if(unit && unit.team !== ig.game.team){
					if(ig.game.map.units[x][y].base){
						this.stats.enemyBases += 1;
					}else
					if(!unit.flag){
						// stats						
						if(unit.soldier) this.stats.enemyUnits.soldier += 1;
						if(unit.tank) this.stats.enemyUnits.tank += 1;
						if(unit.helicopter) this.stats.enemyUnits.helicopter += 1;
						this.stats.enemyUnits.all += 1
					}
				}
			}
		};
	},

	makeToDo: function(){
		
		this.analizeTerrain();

		// buy things
		var r = (Math.random()*10)<<0;

		if(ig.game.turn < 2){
			// starter pack
			this.toDo.buy.push({
				unit: 'soldier',
				quanity: 3
			});
			this.toDo.buy.push({
				unit: 'tank',
				quanity: 1
			});
		}else
		if(this.stats.enemyUnits.all >= this.stats.ownUnits.all || r < 3){
			if((this.stats.enemyUnits.helicopter > this.stats.ownUnits.helicopter  && ig.game.teams[ig.game.team-1].bitcoins >= 6 && ig.game.turn > 5 ) || r == 1) {
				this.toDo.buy.push({
					unit: 'helicopter',
					quanity: 1
				});
			}

			if(this.stats.enemyUnits.tank > this.stats.ownUnits.tank && ig.game.turn > 1 && r < 7 && ig.game.teams[ig.game.team-1].bitcoins > 2){
				this.toDo.buy.push({
					unit: 'tank',
					quanity: 1
				});			
			}

			if((this.stats.enemyUnits.soldier > this.stats.ownUnits.soldier && r < 6 && this.stats.ownUnits.soldier < 8 ) || this.stats.ownUnits.soldier < 3){
				this.toDo.buy.push({
					unit: 'soldier',
					quanity: 1
				});
			}
		}

		

		this.status.buying = true;
		


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
			
			if(this.toDo.move.length > 0){
				ig.game.moveRuler({
					setRow:this.toDo.move[0].row,						
				});	

				for (var y = 0; y < this.toDo.move[0].quanity; y++) {									
					if(this.toDo.move[0].top){
						ig.game.moveRuler({
							up:true
						});				
					}else{
						ig.game.moveRuler({
							down:true
						});
					}
				};
			}			
		}

		if(this.status.moveing && this.timer.delta() > -0.3){			
			
			if(this.toDo.move.length > 1){
				for (var i = 1; i < this.toDo.move.length; i++) {
					
					

					if(this.toDo.move[0].top){
						ig.game.moveRuler({
							setRow:this.toDo.move[i].row,
							up:true
						});				
					}else
					if(this.toDo.move[0].down){
						ig.game.moveRuler({
							setRow:this.toDo.move[i].row,
							down:true
						});
					}else{
						if(Math.random() > 0.5){
							ig.game.moveRuler({
								setRow:this.toDo.move[i].row,
								up:true
							});				
						}else{
							ig.game.moveRuler({
								setRow:this.toDo.move[i].row,
								down:true
							});	
						}
					}
					
				};
				
			}			
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
			this.toDo.buy = [];
			this.toDo.move = [];			
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