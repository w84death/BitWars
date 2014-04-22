/*
----------------------------------------------------------------------------

    KRZYSZTOF JANKOWSKI
    BIT WARS

    abstract: Game about moving the terrain
    created: 18-04-2014
    license: do what you want and dont bother me

    webpage: http://p1x.in
    twitter: @w84death

----------------------------------------------------------------------------
*/
ig.module(
	'game.main'
)
.requires(
	//'impact.debug.debug',
	'impact.game',
	'impact.font',

	// PLUGINS	
	'plugins.gamepad',
	//'plugins.touch-button',
	'plugins.procedural-map',
	'plugins.ai',

	// TERRAIN
	'game.entities.terrain',
	'game.entities.grass',
	'game.entities.tree',
	'game.entities.rock',
	'game.entities.grass_left',
	'game.entities.grass_right',
	'game.entities.base',

	// UNITS
	'game.entities.unit',
	'game.entities.soldier_blue',
	'game.entities.soldier_red',
	'game.entities.tank_blue',
	'game.entities.tank_red',
	'game.entities.helicopter_blue',
	'game.entities.helicopter_red',

	// FLAGS
	'game.entities.flag',
	'game.entities.flag_red',
	'game.entities.flag_blue'
)
.defines(function(){

MyGame = ig.Game.extend({

	// VERSION
	// ------------------------------------------------------------------------	



						version: 		'alpha 0.07',



	// ------------------------------------------------------------------------
	// GFX
	clearColor: 	'#b2dcef',	
	fontWhite: 		new ig.Font( 'media/font/white.png' ),
	fontColor: 		new ig.Font( 'media/font/colors.png' ),
	fontRed: 		new ig.Font( 'media/font/red.png' ),
	fontBlue: 		new ig.Font( 'media/font/blue.png' ),	
	logoImage: 		new ig.Image( 'media/gfx/logo.png' ),
	heroesImage: 	new ig.Image( 'media/gfx/heroes.png' ),
	mapFrameSheet: 	new ig.Image( 'media/gfx/frame.png' ),
	cornerSheet: 	new ig.Image( 'media/gfx/corner.png' ),
	buyButtonsSheet: 	new ig.Image( 'media/gfx/buy_buttons.png' ),
	unitsSheet: 	new ig.Image( 'media/units/units.png' ),
	rulerSheet: 	new ig.Image( 'media/gfx/ruler.png' ),

	// AUDIO
	//sMenu: 			new ig.Sound( 'media/sounds/menu.*', false ),

	// SETTINGS
	debug: 				false,
	
	STATE: 				'intro',
	turn: 				0,
	team: 				1,
	teams: 	[
		{
			ai: 		true,
			score: 		0,
			bitcoins: 	8,
			moves: 		4,

		},{
			ai: 		true,
			score: 		0,
			bitcoins: 	8,
			moves: 		6,
		}
	],
	timer: 				new ig.Timer(),	

	GUI: {
		leftTop: 		null,
		middleTop: 		null,
		rightTop: 		null,
		centerBottom: 	null,
		map: 			null,
		buttons: {
			blue: 		null,
			red: 		null
		},
		labels: {
			start: 		'enter', // O
			next: 		'spacebar', // O
			_1: 		'1',//U
			_2: 		'2',//Y
			_3: 		'3',//A
		}
	},		
	settings: {
		prices: {
			soldier: 		1.5,
			tank: 			3,
			helicopter: 	6
		},
		btcPerTurn: 		1,
		btcFromBase: 		1,
	},
	map: 				{},
	units: 				{},
	ruler: 				[2,6],
	menu: {
		'map': {
			cursor: 		[],
			position: 		0
		},
		'menu': {
			cursor: 		[],
			position: 		0	
		},
		'game_menu': {
			cursor: 		[],
			position: 		0	
		}
	},
	ai: 				true,


	init: function() {

		console.log('\n\nWelcom to the Bit Wars ['+this.version+']\n\nSource code: https://github.com/w84death/BitWars/\n\n--- \n(c)2014 Krzysztof Jankowski\n');

		// GUI

		this.GUI.leftTop = {x:16,y:8};
		this.GUI.centerTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-16,y:8};
		this.GUI.centerBottom = {x:ig.system.width*0.5,y:ig.system.height-8};
		this.GUI.centerMiddle = {x:ig.system.width*0.5,y:ig.system.height*0.5}
		this.GUI.map = {x:ig.system.width*0.5,y:ig.system.height*0.5};
		this.GUI.buttons.blue = {x:16,y:ig.system.height*0.5};
		this.GUI.buttons.red = {x:ig.system.width-16,y:ig.system.height*0.5};

		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y-24);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y);

		this.menu['map'].cursor.push(this.GUI.centerMiddle.y-24);
		this.menu['map'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['map'].cursor.push(this.GUI.centerMiddle.y);

		this.menu['game_menu'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['game_menu'].cursor.push(this.GUI.centerMiddle.y);

		//ig.input.bind( ig.KEY.MOUSE1, 'touch' );	
		

		// KEYS
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY._1, 'buy_1' );
		ig.input.bind( ig.KEY._2, 'buy_2' );
		ig.input.bind( ig.KEY._3, 'buy_3' );
		ig.input.bind( ig.KEY.SPACE, 'next_turn' );



		ig.input.bind( ig.KEY.ENTER, 'action' );

		// GAMEPAD

		ig.input.bind( ig.GAMEPAD.PAD_LEFT, 'left');
		ig.input.bind( ig.GAMEPAD.PAD_RIGHT, 'right');
		ig.input.bind( ig.GAMEPAD.PAD_TOP, 'up');
		ig.input.bind( ig.GAMEPAD.PAD_BOTTOM, 'down');

		ig.input.bind( ig.GAMEPAD.FACE_1, 'next_turn');
		ig.input.bind( ig.GAMEPAD.FACE_2, 'buy_3');
		ig.input.bind( ig.GAMEPAD.FACE_3, 'buy_1');
		ig.input.bind( ig.GAMEPAD.FACE_4, 'buy_2');

		ig.input.bind( ig.OUYA, 'action');		

/*
1 = O
2 = A
3 = U
4 = Y
*/
		// MUSIC LIST
		//ig.music.add( 'media/music/menu.mp3' );
		//ig.music.volume = 0.7;

        // LOAD MENU

		//ig.music.play();

		this.fontWhite.letterSpacing = -1;
        this.fontWhite.lineSpacing = -2;
        this.fontColor.letterSpacing = -1;
        this.fontColor.lineSpacing = -2;
        this.fontRed.letterSpacing = -1;
        this.fontRed.lineSpacing = -2;
        this.fontBlue.letterSpacing = -1;
        this.fontBlue.lineSpacing = -2;       
	},	

	// MAP
	proceduralMap: function(params){
		var newProceduralMap = new ig.ProceduralMap();
		newProceduralMap.generate({
			prefs: {
				width: params.width,
				height: params.height,
				season: 'summer'
			},			
			dna: {
				trees: 0.2,
				rocks: 0.1,
				bases: 4
			}
		})
		this.map = newProceduralMap.get();
		this.map.pointZero = {
			x: this.GUI.map.x - (this.map.blueprint.width*8),
			y: this.GUI.map.y - (this.map.blueprint.height*8) + 8
		}
	},

	stateChange: function(state){
		if ( this.STATE == 'intro' && state == 'menu' ){
			
			this.STATE = 'menu';	
		}

		if ( this.STATE == 'menu' && state == 'map' ){
			if(this.menu['menu'].position === 0){
				this.teams[0].ai = false;				
				this.teams[1].ai = true;				
			}
			if(this.menu['menu'].position === 1){
				this.teams[0].ai = false;				
				this.teams[1].ai = false;					
			}
			if(this.menu['menu'].position === 2){
				this.teams[0].ai = true;				
				this.teams[1].ai = true;					
			}
			
			this.STATE = 'map';	
		}

		if ( this.STATE == 'map' && state == 'game' ){
			

			var params = {};

			if(this.menu['map'].position === 0){
				params.width = 10;				
				params.height = 4;				
			}
			if(this.menu['map'].position === 1){
				params.width = 12;				
				params.height = 6;
			}
			if(this.menu['map'].position === 2){
				params.width = 14;				
				params.height = 7;
			}		

			this.STATE = 'game';
			this.ai = new ig.AI();					
			this.proceduralMap(params);
			this.loadMap();						
		}

		if ( this.STATE == 'game' && state == 'game_menu' ){			
			this.menu['game_menu'].position = 0;
			this.STATE = 'game_menu';
		}

		if ( this.STATE == 'game_menu' && state == 'game' ){
			this.STATE = 'game';
		}

		if ( this.STATE == 'game' && state == 'game_over' ){
			this.STATE = 'game_over';
		}

		if ( (this.STATE == 'game_over' && state == 'menu') || (this.STATE == 'game_menu' && state == 'menu') ){
			
			// clear game
			this.ai = null;								
			this.unloadMap();

			this.STATE = 'menu';
		}
	},

	unloadMap: function(){
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].kill();
		}		
		this.turn = 0;
		this.team = 1;
		this.teams[0].score = 0;
		this.teams[0].bitcoins = 8;
		this.teams[0].moves = 4;
		this.teams[1].score = 0;
		this.teams[1].bitcoins = 8;
		this.teams[1].moves = 4;
		this.timer.set(0);
	},

	loadMap: function(){	
		var newX 	= 0, 
			newY 	= 0,
			name 	= '';


		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {				
				
				newX = (x*16) + this.map.pointZero.x;
				newY = (y*16) + this.map.pointZero.y;
				
				name = 'terrain_'+Math.random().toString();
				this.map.terrain[x][y].name = name;

				if(this.map.terrain[x][y].type === 0){
					ig.game.spawnEntity( EntityGrass, newX, newY, {name:name} );
				}

				if(this.map.terrain[x][y].type === 1){
					ig.game.spawnEntity( EntityTree, newX, newY, {name:name} );
				}

				if(this.map.terrain[x][y].type === 2){
					ig.game.spawnEntity( EntityRock, newX, newY, {name:name} );
				}

				if(this.map.terrain[x][y].type === 3){
					ig.game.spawnEntity( EntityGrass_left, newX, newY, {name:name} );
				}

				if(this.map.terrain[x][y].type === 4){
					ig.game.spawnEntity( EntityGrass_right, newX, newY, {name:name} );
				}

				if(this.map.terrain[x][y].type === 5){					
					ig.game.spawnEntity( EntityBase, newX, newY, {name:name} );					
				}

			}
		}		
	},	

	buyUnit: function(params){
		var x, y, newX, newY, name, 
			spots = [];


		// IF THERE IS SPACE?
		for (var y = 0; y < this.map.blueprint.height; y++) {
			if(params.team === 1 && !this.map.units[0][y]){
				spots.push(y);
			}			
			if(params.team === 2 && !this.map.units[this.map.blueprint.width-1][y]){
				spots.push(y);
			}
		};		

		if(spots.length < 1 && params.unit !== 'flag') return;

		// IF PLAYER HAVE MONEY?
		if(params.unit !== 'flag'){
			if(this.settings.prices[params.unit] <= this.teams[this.team-1].bitcoins){
				this.teams[this.team-1].bitcoins -= this.settings.prices[params.unit];
			}else{
				return;
			}
		}

		// SET NEW POSITIONS

		if(params.unit == 'flag'){
			x = params.team === 1 ? this.map.blueprint.width-1 : 0;	
			y = params.pos;
		}else{
			x = params.team === 1 ? 0 : this.map.blueprint.width -1;
			y = spots[(Math.random()*(spots.length))<<0];	
		}		
		
		newX = this.map.pointZero.x + ( x * 16 );
		newY = this.map.pointZero.y + ( y * 16);
		name = 'unit_'+Math.random().toString();


		// BUY

		if(params.team === 1){
			if(params.unit == 'soldier'){
				ig.game.spawnEntity( EntitySoldier_blue, newX, newY, { name: name, turn:this.turn} );			
			}else
			if(params.unit == 'tank'){
				ig.game.spawnEntity( EntityTank_blue, newX, newY, { name: name, turn:this.turn} );
			}else
			if(params.unit == 'helicopter'){
				ig.game.spawnEntity( EntityHelicopter_blue, newX, newY, { name: name, turn:this.turn} );
			}else	
			if(params.unit == 'flag'){
				ig.game.spawnEntity( EntityFlag_blue, newX, newY, { name: name, turn:this.turn} );
				this.teams[0].score += 1;
			}		
		}		
		if(params.team === 2){
			if(params.unit == 'soldier'){
				ig.game.spawnEntity( EntitySoldier_red, newX, newY, { name: name, turn:this.turn} );
			}else
			
			if(params.unit == 'tank'){
				ig.game.spawnEntity( EntityTank_red, newX, newY, { name: name, turn:this.turn} );
			}else
				
			if(params.unit == 'helicopter'){
				ig.game.spawnEntity( EntityHelicopter_red, newX, newY, { name: name, turn:this.turn} );
			}
			
			if(params.unit == 'flag'){
				ig.game.spawnEntity( EntityFlag_red, newX, newY, { name: name, turn:this.turn} );
				this.teams[1].score += 1;
			}
		}
		this.map.units[x][y] = name;
	},

	// UPDATE

	renderCorners: function(){
		this.cornerSheet.drawTile(0,0,0,64,48);
		this.cornerSheet.drawTile(ig.system.width-64,0,1,64,48);
		this.cornerSheet.drawTile(0,ig.system.height-48,2,64,48);
		this.cornerSheet.drawTile(ig.system.width-64,ig.system.height-48,3,64,48);
		
	},

	renderMapFrame: function(){
		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				// top frame
				if(y == 0){
					newX = (this.map.pointZero.x) + x*16;
					newY = (this.map.pointZero.y - 16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,1,16,16);
				}

				if(y == this.map.blueprint.height-1){
					newX = (this.map.pointZero.x) + x*16;
					newY = (this.map.pointZero.y+16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,7,16,16);
				}

				if(x == 0){
					newX = (this.map.pointZero.x - 16) + x*16;
					newY = (this.map.pointZero.y) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,3,16,16);
				}

				if(x == this.map.blueprint.width-1){
					newX = (this.map.pointZero.x+16) + x*16;
					newY = (this.map.pointZero.y) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,5,16,16);
				}

				if(x == 0 && y == 0){
					newX = (this.map.pointZero.x - 16) + x*16;
					newY = (this.map.pointZero.y - 16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,0,16,16);
				}

				if(x == this.map.blueprint.width-1 && y == 0){
					newX = (this.map.pointZero.x + 16) + x*16;
					newY = (this.map.pointZero.y - 16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,2,16,16);
				}

				if(x == 0 && y == this.map.blueprint.height-1){
					newX = (this.map.pointZero.x - 16) + x*16;
					newY = (this.map.pointZero.y + 16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,6,16,16);
				}

				if(x == this.map.blueprint.width-1 && y == this.map.blueprint.height-1){
					newX = (this.map.pointZero.x + 16) + x*16;
					newY = (this.map.pointZero.y + 16) + y*16;
					this.mapFrameSheet.drawTile(newX,newY,8,16,16);
				}
			}
		}
	},


	giveBTCtoPlayers: function(){
		var base = null;

		this.teams[0].bitcoins += this.settings.btcPerTurn;
		this.teams[1].bitcoins += this.settings.btcPerTurn;

		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				if(this.map.terrain[x][y].base){
					base = this.getEntityByName(this.map.terrain[x][y].name);
					if(base.team){
						this.teams[base.team-1].bitcoins += this.settings.btcFromBase;
					}
				}
			}
		}
	},

	nextTurn: function(){

		if(this.teams[0].score >= this.map.blueprint.height || this.teams[1].score >= this.map.blueprint.height){
			// GAME OVER
			this.stateChange('game_over');
			return;
		}

		this.team += 1;
		if(this.team > 2) {
			this.team = 1;
			this.turn += 1;
			this.giveBTCtoPlayers();
			this.teams[0].moves += 1;
			this.teams[1].moves += 1;
		}		
		if(this.teams[this.team-1].ai){
			this.ai.unlock();
		}
	},

	moveUnits: function(){
		var unit = false,
			unitsMoving = false,
			base = null,
			enemy = null,
			targetX;
			
		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				// if there is a unit?
				if(this.map.units[x][y]){
					// get unit object
					unit = this.getEntityByName(this.map.units[x][y]);
					
					// my unit and have moves left?
					if(unit.turn == this.turn && unit.team === this.team){
						
						// and it's not a fking flag
						if(!unit.flag){

							// unit waits for orders
							if(!unit.target){
								if(unit.team === 1){
									targetX = x+1;
								}else{
									targetX = x-1;
								}
									
								if(this.map.terrain[targetX][y].type < unit.terrain || this.map.terrain[targetX][y].type > 2){
									// next field is empty
									
									// there is a unit
									if(this.map.units[targetX][y]){
										enemy = this.getEntityByName(this.map.units[targetX][y]);	

										if(enemy.team !== unit.team && !enemy.flag){
											// enemy
											unit.willAttack = true;
											unit.target = targetX;
										}else
										if(enemy.team === unit.team || enemy.flag){
											// own unit or flag
											// wait
											unit.target = -999;
											unit.willAttack = false;
											unit.turn = this.turn + 1;
											unit.vel.x = 0;
										}
									}else{
										// if there is a base? 
										if(this.map.terrain[targetX][y].base && !unit.helicopter){
											// and its not my team?
											base = this.getEntityByName(this.map.terrain[targetX][y].name);
											if(base.team !== unit.team){
												unit.willCapture = true;	
											} else{
												unit.willCapture = false;
											}
										}
										// set target
										unit.target = targetX;
									}										
								}else{
									// wait for better times
									unit.target = -999;
									unit.willAttack = false;
									unit.turn = this.turn + 1;
									unit.vel.x = 0;
								}							
							}
						}	

						// unit have a target and wants to move
						if(unit.target > -1){
							// move the unit
							if(unit.team === 1 && this.map.pointZero.x + (unit.target * 16) > unit.pos.x){
								unit.vel.x = unit.speed;
								unitsMoving = true;
							}else
							if(unit.team === 2 && this.map.pointZero.x + (unit.target * 16) < unit.pos.x){
								unit.vel.x = -unit.speed;
								unitsMoving = true;							
							}else{
								// unit arrive at its target tile

								// unit gets to the enemy line - convert to flag			
								if((unit.team === 2 && unit.target < 1) || (unit.team === 1 && unit.target > (this.map.blueprint.width-2))){									
									
									this.buyUnit({
										team: 	unit.team,
										unit: 	'flag',
										pos: 	y
									});
									
									this.map.units[x][y] = false;									
									unit.target = false;
									unit.willCapture = false;									
									unit.kill();
								}else
								// if there is a base to capture
								if( unit.willCapture && this.map.terrain[unit.target][y].name){

									// find the object and capture
									var base = this.getEntityByName(this.map.terrain[unit.target][y].name);												
									if(base){
										base.capture(unit.team);
									}
										this.map.units[x][y] = false;									
										unit.target = false;
										unit.willCapture = false;									
										unit.kill();
									

								}else{
									
									// if there is an enemy?
									if( unit.willAttack && this.map.units[unit.target][y]){
										enemy = this.getEntityByName(this.map.units[unit.target][y]);
										
										// FIGHT!
										if(enemy.power < unit.power){
											// win
											enemy.kill();	
											this.map.units[unit.target][y] = false;
										}else
										if(enemy.power == unit.power){
											// tie
											enemy.kill();	
											this.map.units[unit.target][y] = false;
											this.map.units[x][y] = false;									
											unit.target = false;
											unit.willAttack = false;
											unit.willCapture = false;									
											unit.kill();
														
										}else{
											// lose
											this.map.units[x][y] = false;									
											unit.target = false;									
											unit.willAttack = false;
											unit.willCapture = false;
											unit.kill();
										}																										
									}

									// move the unit in the map data
									if(unit.target){
										unit.name = this.map.units[x][y];
										this.map.units[unit.target][y] = this.map.units[x][y];
										this.map.units[x][y] = false;									
										unit.target = false;
										unit.turn = this.turn + 1;
										unit.vel.x = 0;
										unit.willCapture = false;
										unit.willAttack = false;
									}
								}									
							}					
						}
					}
				}
			}
		};
		if(!unitsMoving){


			this.STATE = 'game';
			this.nextTurn();

			for (var x = 0; x < this.map.blueprint.width; x++) {
				for (var y = 0; y < this.map.blueprint.height; y++) {
					unit = this.getEntityByName(this.map.units[x][y]);
					if(unit) {
						unit.target = false;
						unit.turn = this.turn;
					}
				}
			}
		}

	},

	moveRow: function(params){
		var temp = {},
			tempUnit = {},
			tile = null,
			unit = null,
			unitsInRow = 0;		

		
		for (var y = 0; y < this.map.blueprint.height; y++) {
			unit = this.getEntityByName(this.map.units[params.row][y]);
			if(unit && unit.team !== this.team){
				unitsInRow += 1;
			}
		}
		
		if(unitsInRow == 0){
			if(this.teams[this.team-1].moves > 0){
				this.teams[this.team-1].moves -= 1;
			}else{
				return;
			}
		}

		if(params.up && unitsInRow == 0){
			
			temp.type = this.map.terrain[params.row][0].type;
			temp.name = this.map.terrain[params.row][0].name;
			temp.base = this.map.terrain[params.row][0].base;
			tempUnit = this.map.units[params.row][0];

			for (var y = 1; y < this.map.blueprint.height; y++) {				
				tile = this.getEntityByName(this.map.terrain[params.row][y].name);
				if(this.map.units[params.row][y]){
					unit = this.getEntityByName(this.map.units[params.row][y]);
					unit.pos.y -= 16;				
				}
				tile.pos.y -= 16;				
				this.map.terrain[params.row][y-1].type = this.map.terrain[params.row][y].type;
				this.map.terrain[params.row][y-1].name = this.map.terrain[params.row][y].name;
				this.map.terrain[params.row][y-1].base = this.map.terrain[params.row][y].base;				
				this.map.units[params.row][y-1] = this.map.units[params.row][y];				
			}
			this.map.terrain[params.row][this.map.blueprint.height-1].type = temp.type;
			this.map.terrain[params.row][this.map.blueprint.height-1].name = temp.name;
			this.map.terrain[params.row][this.map.blueprint.height-1].base = temp.base;
			this.map.units[params.row][this.map.blueprint.height-1] = tempUnit;
			tile = this.getEntityByName(this.map.terrain[params.row][this.map.blueprint.height-1].name);
			if(this.map.units[params.row][this.map.blueprint.height-1]){
				unit = this.getEntityByName(this.map.units[params.row][this.map.blueprint.height-1]);
				unit.pos.y = this.map.pointZero.y + (this.map.blueprint.height-1)*16;
			}
			tile.pos.y = this.map.pointZero.y + (this.map.blueprint.height-1)*16;			
			temp = {};
			unit = {};
		}
		if(params.down && unitsInRow == 0){

			temp.type = this.map.terrain[params.row][this.map.blueprint.height-1].type;
			temp.name = this.map.terrain[params.row][this.map.blueprint.height-1].name;
			temp.base = this.map.terrain[params.row][this.map.blueprint.height-1].base;
			tempUnit = this.map.units[params.row][this.map.blueprint.height-1];

			for (var y = this.map.blueprint.height-2; y > -1; y--) {		
				tile = this.getEntityByName(this.map.terrain[params.row][y].name);
				tile.pos.y += 16;	
				if(this.map.units[params.row][y]){
					unit = this.getEntityByName(this.map.units[params.row][y]);
					unit.pos.y += 16;
				}			
				this.map.terrain[params.row][y+1].type = this.map.terrain[params.row][y].type;
				this.map.terrain[params.row][y+1].name = this.map.terrain[params.row][y].name;
				this.map.terrain[params.row][y+1].base = this.map.terrain[params.row][y].base;				
				this.map.units[params.row][y+1] = this.map.units[params.row][y];								
			}
			this.map.terrain[params.row][0].type = temp.type;
			this.map.terrain[params.row][0].name = temp.name;
			this.map.terrain[params.row][0].base = temp.base;
			this.map.units[params.row][0] = tempUnit;
			tile = this.getEntityByName(this.map.terrain[params.row][0].name);
			tile.pos.y = this.map.pointZero.y;
			if(this.map.units[params.row][0]){
				unit = this.getEntityByName(this.map.units[params.row][0]);
				unit.pos.y = this.map.pointZero.y;
			}
			temp = {};
			unit = {};
		}
	},

	moveRuler: function(params){		
		if(params.setRow){
			this.ruler[this.team-1] = params.setRow;
		}

		if(params.right){
			this.ruler[this.team-1] += 1;
			if(this.ruler[this.team-1] > this.map.blueprint.width-2){
				this.ruler[this.team-1] = 1;
			}			
			
		}
		if(params.left){
			this.ruler[this.team-1] -= 1;
			if(this.ruler[this.team-1] < 1){
				this.ruler[this.team-1] = this.map.blueprint.width-2;
			}
		}

		if(params.up){
			this.moveRow({
				row: this.ruler[this.team-1],
				up: true
			});
		}

		if(params.down){
			this.moveRow({
				row: this.ruler[this.team-1],
				down: true
			});
		}
	},

	moveCursor: function(params){
		//if(params.menu){
			if(params.up){
				this.menu[this.STATE].position -= 1;
				if(this.menu[this.STATE].position < 0){
					this.menu[this.STATE].position = this.menu[this.STATE].cursor.length-1;
				}		
			}
			if(params.down){
				this.menu[this.STATE].position += 1;
				if(this.menu[this.STATE].position > this.menu[this.STATE].cursor.length-1){
					this.menu[this.STATE].position = 0;
				}		
			}
		//}
	},

	update: function() {		
		this.parent();
		
		if(this.STATE == 'intro'){
			
			if(ig.input.released('action') || ig.input.released('next_turn')){
				this.stateChange('menu');				
				return;
			}
		}

		if(this.STATE == 'menu' || this.STATE == 'map' || this.STATE == 'game_menu'){
			if(ig.input.released('up')){
				this.moveCursor({up:true});
			}
			if(ig.input.released('down')){
				this.moveCursor({down:true});
			}
			if(ig.input.released('action') || ig.input.released('next_turn')){				
				
				if(this.STATE == 'menu') {
					this.stateChange('map');
				}else
				if(this.STATE == 'map'){
					this.stateChange('game');		
				}
				if(this.STATE == 'game_menu'){
					if(this.menu['game_menu'].position === 0){
						this.stateChange('game');				
					}
					if(this.menu['game_menu'].position === 1){
						this.stateChange('menu');					
					}
				}		
				return;
			}
		}

		if(this.STATE == 'game'){
			// AI turn?
			if(ig.input.released('action')){
				this.stateChange('game_menu');
			}else
			if(this.teams[this.team-1].ai){				
				this.ai.think();				

				// ai has finished
				if(this.ai.timer.delta() > 0){
					this.STATE = 'move';
				}
			}else{
				// Player turn
				if(ig.input.released('buy_1')){
					this.buyUnit({
						unit: 'soldier',
						team: this.team
					});
				}
				if(ig.input.released('buy_2')){
					this.buyUnit({
						unit: 'tank',
						team: this.team
					});
				}
				if(ig.input.released('buy_3')){
					this.buyUnit({
						unit: 'helicopter',
						team: this.team
					});
				}
				if(ig.input.released('next_turn')){
					this.STATE = 'move';
				}
				if(ig.input.released('left')){
					this.moveRuler({left:true});
				}
				if(ig.input.released('right')){
					this.moveRuler({right:true});
				}
				if(ig.input.released('up')){
					this.moveRuler({up:true});
				}
				if(ig.input.released('down')){
					this.moveRuler({down:true});
				}
			}
			
		}

		if(this.STATE == 'move'){
			this.moveUnits();
		}

		if(this.STATE == 'game_over'){
			if(ig.input.released('action') || ig.input.released('next_turn')){
				this.stateChange('menu');	
			}
		}
		
	},	

	// DRAW

	drawRuler: function(){
		var newX, newY, tile;

		for (var y = -1; y < this.map.blueprint.height+1; y++) {
			newX = (this.ruler[this.team-1]*16) + this.map.pointZero.x;
			newY = (y*16)+this.map.pointZero.y;
			tile = (this.team === 1 ? 2 : 5);
			if(y == -1) tile = (this.team === 1 ? 0 : 3);
			if(y > this.map.blueprint.height-1) tile = (this.team === 1 ? 1 : 4);

			this.rulerSheet.drawTile(newX, newY, tile, 16,16);	
		}
		
	},

	draw: function() {		
		
		
		this.parent();
		
		if(this.STATE == 'intro'){

			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);
			this.heroesImage.draw(this.GUI.centerTop.x-30, this.GUI.centerTop.y+48);

			this.fontWhite.draw('Version '+this.version, this.GUI.centerBottom.x, this.GUI.centerBottom.y-60, ig.Font.ALIGN.CENTER );

			if( (this.timer.delta()*3).toFixed(0) % 2 == 0){
				this.fontWhite.draw('PRESS '+this.GUI.labels.start, this.GUI.centerBottom.x, this.GUI.centerBottom.y-48, ig.Font.ALIGN.CENTER );
			}
			this.fontColor.draw('Game design & code: Krzysztof Jankowski', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontColor.draw('(c) 2014 P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
		}	

		if(this.STATE == 'menu' || this.STATE == 'map'){
			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);

			
			if(this.STATE == 'map'){
				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('SMALL 10x4 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('SMALL 10x4 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('NORMAL 12x6 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('NORMAL 12x6 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 2){
					this.fontColor.draw('BIG 14x7 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('BIG 14x7 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}
			}
			if(this.STATE == 'menu'){
				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('HUMAN VS AI', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('HUMAN VS AI', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('HUMAN VS HUMAN', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('HUMAN VS HUMAN', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 2){
					this.fontColor.draw('AI VS AI', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('AI VS AI', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}
			}

			this.heroesImage.drawTile(this.GUI.centerTop.x-72, this.menu[this.STATE].cursor[this.menu[this.STATE].position]-12,1,30,28);
			this.heroesImage.drawTile(this.GUI.centerTop.x+42, this.menu[this.STATE].cursor[this.menu[this.STATE].position]-12,0,30,28);			

			this.fontColor.draw('QUICK TUTORIAL\n'+
				'Move terrain (without enemy units) up or down.\n'+
				'Manage to cross enemy lines with your units.', this.GUI.centerBottom.x, this.GUI.centerBottom.y-38, ig.Font.ALIGN.CENTER );
		}	

		

		if(this.STATE == 'game' || this.STATE == 'move' || this.STATE == 'game_menu' || this.STATE == 'game_over'){			
			this.renderMapFrame();

			if(this.STATE == 'game'){
				var newX, newY;	

				newX = this.team === 1 ? this.GUI.buttons.blue.x : this.GUI.buttons.red.x-32,
				newY = this.team === 1 ? this.GUI.buttons.blue.y : this.GUI.buttons.red.y;

				this.fontWhite.draw('BUY UNITS:\nYOU HAVE: '+this.teams[this.team-1].bitcoins.toFixed(1), newX+14, newY-48, ig.Font.ALIGN.CENTER );

				this.buyButtonsSheet.drawTile(newX,newY-24,this.team-1,32,16);
				this.buyButtonsSheet.drawTile(newX,newY,this.team-1,32,16);
				this.buyButtonsSheet.drawTile(newX,newY+24,this.team-1,32,16);			

				this.unitsSheet.drawTile(newX+2, newY-3-24, this.team === 1 ? 0 : 3, 16, 16);
				this.unitsSheet.drawTile(newX+2, newY-3, this.team === 1 ? 6 : 9, 16, 16);
				this.unitsSheet.drawTile(newX+2, newY-3+24, this.team === 1 ? 12 : 16, 16, 16);

				this.fontWhite.draw('['+ this.GUI.labels._1 +']', newX+2, newY+9-24, ig.Font.ALIGN.CENTER );		
				this.fontWhite.draw('['+ this.GUI.labels._2 +']', newX+2, newY+9, ig.Font.ALIGN.CENTER );		
				this.fontWhite.draw('['+ this.GUI.labels._3 +']', newX+2, newY+9+24, ig.Font.ALIGN.CENTER );


				if(this.settings.prices.soldier <= this.teams[this.team-1].bitcoins){
					this.fontWhite.draw('1', newX+24, newY+2-24, ig.Font.ALIGN.CENTER );
				}else{
					this.fontColor.draw('1', newX+24, newY+2-24, ig.Font.ALIGN.CENTER );
				}

				if(this.settings.prices.tank <= this.teams[this.team-1].bitcoins){	
					this.fontWhite.draw('3', newX+24, newY+2, ig.Font.ALIGN.CENTER );	
				}else{
					this.fontColor.draw('3', newX+24, newY+2, ig.Font.ALIGN.CENTER );	
				}

				if(this.settings.prices.helicopter <= this.teams[this.team-1].bitcoins){	
					this.fontWhite.draw('6', newX+24, newY+2+24, ig.Font.ALIGN.CENTER );
				}else{
					this.fontColor.draw('6', newX+24, newY+2+24, ig.Font.ALIGN.CENTER );
				}
				
				newX = (this.team === 1 ? this.GUI.buttons.blue.x + 48 : this.GUI.buttons.red.x - 48);
				this.buyButtonsSheet.drawTile(newX-16,this.GUI.centerBottom.y-12,this.team-1,32,16);						
				this.fontWhite.draw('['+ this.GUI.labels.next +']', newX-12, this.GUI.centerBottom.y-3, ig.Font.ALIGN.RIGHT );										
				this.fontWhite.draw('DONE', newX, this.GUI.centerBottom.y-9, ig.Font.ALIGN.CENTER );
				this.drawRuler();

				// FOLLOW THE RABBIT!
				if(this.team === 1){
					this.fontBlue.draw(this.teams[0].moves, (this.ruler[0] * 16 ) + this.map.pointZero.x, this.map.pointZero.y + (this.map.blueprint.height*16)+8, ig.Font.ALIGN.CENTER );					
				}else{
					this.fontRed.draw(this.teams[1].moves, (this.ruler[1] * 16 ) + this.map.pointZero.x, this.map.pointZero.y + (this.map.blueprint.height*16)+8, ig.Font.ALIGN.CENTER );
				}
			}


			if(this.STATE == 'game_over'){

				this.fontWhite.draw('TEAM '+ ( this.teams[0].score > this.teams[1].score ? 'BLUE' : 'RED' ) + ' WINS!', this.GUI.centerMiddle.x, this.GUI.centerMiddle.y, ig.Font.ALIGN.CENTER );		
				if( (this.timer.delta()*3).toFixed(0) % 2 == 0){
					this.fontWhite.draw('PRESS '+this.GUI.labels.start, this.GUI.centerMiddle.x, this.GUI.centerMiddle.y+12, ig.Font.ALIGN.CENTER );
				}
			}

			if(this.STATE == 'game_menu'){

				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('RESUME', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('RESUME', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('SURRENDER', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('SURRENDER', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
				
			}

			this.heroesImage.drawTile(this.GUI.leftTop.x, this.GUI.leftTop.y,1,30,28);
			this.heroesImage.drawTile(this.GUI.rightTop.x-30, this.GUI.rightTop.y,0,30,28);			

			this.fontBlue.draw(this.teams[0].score, this.GUI.leftTop.x, this.GUI.leftTop.y+22, ig.Font.ALIGN.LEFT );							
			this.fontRed.draw(this.teams[1].score, this.GUI.rightTop.x, this.GUI.rightTop.y+22, ig.Font.ALIGN.RIGHT );		

			this.fontWhite.draw('SUMMER', this.GUI.centerTop.x, this.GUI.centerTop.y, ig.Font.ALIGN.CENTER );					
			this.fontWhite.draw('TURN - ' + this.turn, this.GUI.centerTop.x, this.GUI.centerTop.y+10, ig.Font.ALIGN.CENTER );					
			if(this.team === 1){
				this.fontBlue.draw('TEAM BLUE TURN', this.GUI.centerTop.x, this.GUI.centerTop.y+20, ig.Font.ALIGN.CENTER );						
			}else{
				this.fontRed.draw('TEAM RED TURN', this.GUI.centerTop.x, this.GUI.centerTop.y+20, ig.Font.ALIGN.CENTER );		
				
			}
		}		

		this.renderCorners();
	}
});

	var w = 320,
		h = 180,
		z = 3,
		fps = 24;

	//if( ig.ua.mobile ) {
		//ig.Sound.enabled = false;
	//}
	ig.Sound.channels = 16;

	var c = document.createElement('canvas');
  	c.id = 'canvas';
  	document.body.appendChild(c);

	ig.main( '#canvas', MyGame, fps, w, h, z);

});