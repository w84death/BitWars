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
	heatMap: 	[],
	heatMapKey: {
		'terrain_clear' : 	[2,5],
		'terrain_blocked' : [-3,-2],
		'enemy_low': 		[2,4],
		'enemy_equal': 		[0,-1],
		'enemy_high': 		[-4,-4],		
		'enemy_base' : 		[2,3],
		'ally_unit': 		[-1,-2],
		'flag' : 			[-10,-5],
		'cpu': 				[6,12]
	},
	timer: 		new ig.Timer(),
	turnTime: 	1,
	moveTime: 	0.5,
	lastMoveTime: 	-0.2,
	moveNo: 	0,	
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
	clearRows:  		[],
	log: 				false,
	
	init: function(){
		if(this.log) console.log('AI initialized. Now will conquer the world!');
	},

	analizeTerrain: function(){
		var unit, enemy, newX, up, down, blackRows = [];

		this.stats.ownUnits.soldier = 0;
		this.stats.ownUnits.tank = 0;
		this.stats.ownUnits.helicopter = 0;
		this.stats.ownUnits.all = 0;

		this.stats.enemyUnits.soldier = 0;
		this.stats.enemyUnits.tank = 0;
		this.stats.enemyUnits.helicopter = 0;
		this.stats.enemyUnits.all = 0;
		
		for (var i = 0; i < ig.game.map.blueprint.width; i++) {
			blackRows[i] = false;
		};

		// make stats and flag rows without move (blackRows)		
		for (var x = 0; x < ig.game.map.blueprint.width; x++) {
			this.heatMap[x] = [];
			for (var y = 0; y < ig.game.map.blueprint.height; y++) {
				this.heatMap[x][y] = 0;
				unit = ig.game.getEntityByName(ig.game.map.units[x][y]);
				if(unit && unit.team === ig.game.team){
					if(unit.base){
						// its our own base
						this.stats.ownBases += 1;
					}else
					// don't count the flags
					if(!unit.flag && !unit.cpu){
						// STATS						
						if(unit.soldier) this.stats.ownUnits.soldier += 1;
						if(unit.tank) this.stats.ownUnits.tank += 1;
						if(unit.helicopter) this.stats.ownUnits.helicopter += 1;
						this.stats.ownUnits.all += 1						
					}					
				}
				if(unit && unit.team !== ig.game.team){
					blackRows[x] = true;
					if(unit.base){
						this.stats.enemyBases += 1;
					}else
					if(!unit.flag && !unit.cpu){
						// stats						
						if(unit.soldier) this.stats.enemyUnits.soldier += 1;
						if(unit.tank) this.stats.enemyUnits.tank += 1;
						if(unit.helicopter) this.stats.enemyUnits.helicopter += 1;
						this.stats.enemyUnits.all += 1
					}
				}
			}
		}
	},

	makeToDo: function(){		
		var dir, enemy, key, newX, newY, r = (Math.random()*10)<<0;

		// BUYING
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

		// MOVEING

		// GENERATE HIT MAP


		// change settings based on stats

		// priorityze taking bases
		if(this.stats.enemyBases >= this.stats.ownBases){
			this.heatMapKey['enemy_base'] =	[4,6];
		}else{
			this.heatMapKey['enemy_base'] =	[1,1];
		}



		
		dir = (ig.game.team === 1 ? 1 : -1 );

		// analize all the units and modify the big heat map
		for (var x = 0; x < ig.game.map.blueprint.width; x++) {
			for (var y = 0; y < ig.game.map.blueprint.height; y++) {
				this.clearRows.push(true);

				// take only our team unit
				if(ig.game.map.units[x][y]){
					unit = ig.game.getEntityByName(ig.game.map.units[x][y]);
					if(unit && unit.team === ig.game.team && !unit.base && !unit.flag){

						// analize enemy

						// front row
						for (var i = 0; i < 3; i++) {
							if(i === 0) newY = y-1;
							if(i === 1) newY = y;
							if(i === 2) newY = y+1;

							if(newY < 0) newY = ig.game.map.blueprint.height-1;
							if(newY > ig.game.map.blueprint.height-1) newY = 0;	

							if(ig.game.map.units[x+dir][newY]){
								enemy = ig.game.getEntityByName(ig.game.map.units[x+dir][newY]);
								if(enemy.flag){
									key = 'flag';
								}else
								if(enemy.cpu){
									key = 'cpu';
								}else
								if(enemy.team === unit.team){
									if(!enemy.base){										
										key = 'ally_unit';
									}
								}else{
									if(enemy.base){
										key = 'enemy_base';
									}else{
										if(enemy.power > unit.power) key = 'enemy_high';
										if(enemy.power === unit.power) key = 'enemy_equal';
										if(enemy.power < unit.power) key = 'enemy_low';
									}
								}						
								// the last modulo is for preventing two units to have the same pioryty 
								// next to the two flags and end up doing nothing
								this.heatMap[x+dir][newY] = this.heatMapKey[key][0] + (y % 2 ? 1 : 0);
								this.heatMap[x][newY] = this.heatMapKey[key][1] + (y % 2 ? 1 : 0);
							}
						};
						
						// analize terrain

						for (var i = 0; i < 3; i++) {
							if(i === 0) newY = y-1;							
							if(i === 1) newY = y;
							if(i === 2) newY = y+1;						

							if(newY < 0) newY = ig.game.map.blueprint.height-1;
							if(newY > ig.game.map.blueprint.height-1) newY = 0;	

							if(ig.game.map.terrain[x+dir][newY].type >= unit.terrain && ig.game.map.terrain[x+dir][newY].type < 3){								
								key = 'terrain_blocked';
							}else{
								key = 'terrain_clear';
							}
						
							this.heatMap[x+dir][newY] += this.heatMapKey[key][0];
							this.heatMap[x][newY] += this.heatMapKey[key][1];

						};

					}else
					if(unit && unit.team === ig.game.team){
						this.clearRows[x] == false;
					}
				}
			}			
		};		

		// first and last are always blocked
		this.clearRows[0] == false;
		this.clearRows[this.clearRows.length-1] == false;

		// MAKE TODO LIST FOR MOVEING

		var heatMapList = {
				front: {},
				back: {}
			},
			top = {
				front: -10,
				back: -10
			};		

		for (var x = 0; x < ig.game.map.blueprint.width; x++) {
			for (var y = 0; y < ig.game.map.blueprint.height; y++) {
				if(ig.game.map.units[x][y]){
					unit = ig.game.getEntityByName(ig.game.map.units[x][y]);
					if(unit && unit.team === ig.game.team && !unit.flag && !unit.base){						
						
						for (var i = 0; i < 3; i++) {
							newX = x+dir;
							if(i === 0) newY = y-1;
							if(i === 1) newY = y;
							if(i === 2) newY = y+1;

							if(newY < 0) {
								newY = ig.game.map.blueprint.height-1;

							}
							if(newY > ig.game.map.blueprint.height-1){
							 	newY = 0;
							}

							if(this.heatMap[newX][newY] > top.front){
								top.front = this.heatMap[newX][newY];
								heatMapList.front = {x:newX, y:newY};
							}
							if(this.heatMap[newX][newY] > top.back){
								top.back = this.heatMap[newX][newY]
								heatMapList.back = {x:newX, y:newY};
							}
						}
					
						if(top.front > top.back && this.clearRows[x+dir]){
							if(heatMapList.front.y < y){
								up = true;
								down = false;
							}else
							if(heatMapList.front.y > y){
								up = false;
								down = true;
							}else{
								up = false;
								down = false;
							}
							
							if(up || down){
								this.toDo.move.push({
									row: x+dir,
									up: up,
									down: down
								});
							}
						}else
						if(this.clearRows[x]){
							if(heatMapList.back.y < y){
								up = true;
								down = false;
							}else
							if(heatMapList.back.y > y){
								up = false;
								down = true;
							}else{
								up = false;
								down = false;
							}
							
							if(up || down){
								this.toDo.move.push({
									row: x,
									up: up,
									down: down
								});
							}
						}
					}
				}
			}
		}

		this.status.moveing = true;

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
		if(this.status.moveing && this.timer.delta() > this.lastMoveTime){		
			if(this.moveNo < this.toDo.move.length){								
				if(!this.toDo.move[this.moveNo].done){						
					ig.game.moveRuler({
						setRow:this.toDo.move[this.moveNo].row,
						up:this.toDo.move[this.moveNo].up,
						down:this.toDo.move[this.moveNo].down
					});
					this.toDo.move[this.moveNo].done = true;														
					this.moveNo += 1;
					this.lastMoveTime -= this.moveTime;					
				}				
			}else{				
				this.status.moveing = false;
			}
		}	

		// 80% time = done
		if(!this.status.moveing && this.timer.delta() > 0){
			this.status.thinking = false;
		}
	},

	unlock: function(){
		this.status.thinking = true;
		this.status.init = false;		
	},

	think: function(){
		if(!this.status.init){
			// set timer
			this.timer.set(this.turnTime);		
			this.toDo.buy = [];
			this.toDo.move = [];	
			this.moveNo = 0;
			this.lastMoveTime = -0.5;		
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