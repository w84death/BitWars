// this is ai
// amaizing inteligence
//
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
	log: true,
	
	init: function(){
		if(this.log) console.log('AI initialized. Now will conquer the world!');
	},

	analizeTerrain: function(params){
		var unit, enemy, dir, newX, up, down;

		this.stats.ownUnits.soldier = 0;
		this.stats.ownUnits.tank = 0;
		this.stats.ownUnits.helicopter = 0;
		this.stats.ownUnits.all = 0;

		this.stats.enemyUnits.soldier = 0;
		this.stats.enemyUnits.tank = 0;
		this.stats.enemyUnits.helicopter = 0;
		this.stats.enemyUnits.all = 0;

		dir = (ig.game.team === 1 ? 1 : -1 );
		
		if(params && params.calculateMoves){
			if(this.log) console.log('-[ '+ ig.game.turn + ']- ------- AI calculate moves ------');
		}

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

						// MOVE?

						if(params && params.calculateMoves){

							// TERRAIN
							// it's unit an we need to check if he has a clear path forward
							if(this.log) console.log(x,y,'search terrain', ig.game.map.terrain[x+dir][y].type, unit.terrain)

							if(ig.game.map.terrain[x+dir][y].type >= unit.terrain && ig.game.map.terrain[x+dir][y].type < 3 ){							
								if(this.log) console.log(x,y,'move terrain')
								if( ((Math.random()*10)<<0) <= 5){
									up = false;
									down = true;
								}else{
									up = true;
									down = false;
								}
								newX = ((x == 0 || x == ig.game.map.blueprint.width-1) ? x+dir : x);
								this.toDo.move.push({
									row: newX,
									quanity: 1,
									up:up,
									down:down
								});
								this.status.moveing = true;
							}else{
								if(this.log) console.log(x,y,'search for units')
								// UNITS
								// if there's an powerfull enamy try to move out
								// or flag
								enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y]);
								
								// check if enemy is not our unit
								if(enemy && enemy.team !== unit.team){
									if(this.log) console.log(x,y,'found enemy')
									if( enemy.power > unit.power || enemy.flag ){
										if(this.log) console.log(x,y,'enemy power: ' +enemy.power, 'my power: ' + unit.power, 'retreat')
										if( ((Math.random()*10)<<0) <= 5){
											up = false;
											down = true;
										}else{
											up = true;
											down = false;
										}
										this.toDo.move.push({
											row: x,
											quanity: 1,
											up: up,
											down: down
										});
										this.status.moveing = true;
									}else
									if(unit.power > 1 && enemy.power <= unit.power){
										// go for it!
										if(this.log) console.log(x,y,'enemy power: ' +enemy.power, 'my power: ' + unit.power, 'attack')
									}else{									
										// search for cross tiles
										if(this.log) console.log(x,y,'earch for cross tiles')
										// up tile
										if(y > 0){
											enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y-1]);
										}else{
											enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][ig.game.map.blueprint.height-1]);
										}
										
										if(enemy){
											up = false;
											down = true;
										}else{
											// bottom tile
											enemy = false;

											if(y < ig.game.map.blueprint.height-1){
												enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][y+1]);
											}else{
												enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][0]);
											}

											if(enemy){
												up = true;
												down = false;
											}
										}

										// now decide
										if(enemy){
											if(enemy.base){
												this.toDo.move.push({
													row: x,
													up:up,
													down: down,								
													quanity: 1
												});
												this.status.moveing = true;
											}

											if(enemy.power < unit.power || (unit.power > 1 && enemy.power <= unit.power)){
												this.toDo.move.push({
													row: x,
													up: up,
													down: down,
													quanity: 1
												});
												this.status.moveing = true;
											}						
										}
									}
								}else{
									// our unit!
									// we need to move

									if( ((Math.random()*10)<<0) <= 5){
										up = false;
										down = true;
									}else{
										up = true;
										down = false;
									}
									this.toDo.move.push({
										row: x,
										quanity: 1,
										up: up,
										down: down
									});
									this.status.moveing = true;
								}
							}
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


		if(ig.game.turn < 2 && this.stats.enemyUnits.helicopter === 0){
			// if first turn and enemy don't buy helicopter already..
			// buy a starter pack
			this.toDo.buy.push({
				unit: 'soldier',
				quanity: 3
			});
			this.toDo.buy.push({
				unit: 'tank',
				quanity: 1
			});
		}else
		if(ig.game.turn < 3 && this.stats.enemyUnits.helicopter > 0){
			// ..but if he bough buy one to!
			this.toDo.buy.push({
				unit: 'helicopter',
				quanity: 1
			});
			this.toDo.buy.push({
				unit: 'soldier',
				quanity: 3
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

		this.analizeTerrain({calculateMoves:true});

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

		if(this.status.moveing){						
						
			if(this.toDo.move.length > 0 && !this.toDo.move[0].done){
				
				if(this.toDo.move[0].row == 0){
					this.toDo.move[0].row = 1;
				}
				if(this.toDo.move[0].row == ig.game.map.blueprint.width-1){
					this.toDo.move[0].row = ig.game.map.blueprint.width-2;
				}

				ig.game.moveRuler({
					setRow:this.toDo.move[0].row,
					up:this.toDo.move[0].up,
					down:this.toDo.move[0].down
				});			
				this.toDo.move[0].done = true;		
			}			
		}

		if(this.status.moveing && this.timer.delta() > -0.3){			
			
			if(this.toDo.move.length > 0){				
				for (var i = 1; i < this.toDo.move.length; i++) {					
					if(!this.toDo.move[i].done){
						if(this.toDo.move[i].row == 0){
							this.toDo.move[i].row= 1;
						}
						if(this.toDo.move[i].row == ig.game.map.blueprint.width-1){
							this.toDo.move[i].row = ig.game.map.blueprint.width-2;
						}

						ig.game.moveRuler({
							setRow:this.toDo.move[i].row,
							up:this.toDo.move[i].up,
							down:this.toDo.move[i].down
						});
						this.toDo.move[i].done = true;														
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