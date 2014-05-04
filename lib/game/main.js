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
	'game.entities.funcy_background',
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
	'game.entities.flag_blue',

	// ETC
	'game.entities.cpu'
)
.defines(function(){

MyGame = ig.Game.extend({

	// VERSION
	// ------------------------------------------------------------------------	



						version: 		'beta 4',



	// ------------------------------------------------------------------------
	// GFX
	clearColor: 	'#b2dcef',	
	fontWhite: 		new ig.Font( 'media/font/white.png' ),
	fontColor: 		new ig.Font( 'media/font/colors.png' ),
	fontOUYA: 		new ig.Font( 'media/font/ouya.png' ),
	fontRed: 		new ig.Font( 'media/font/red.png' ),
	fontBlue: 		new ig.Font( 'media/font/blue.png' ),	
	logoImage: 		new ig.Image( 'media/gui/logo.png' ),
	heroesImage: 	new ig.Image( 'media/gui/heroes.png' ),
	mapFrameSheet: 	new ig.Image( 'media/gui/frame.png' ),
	cornerSheet: 	new ig.Image( 'media/gui/corner.png' ),
	statsSheet: 	new ig.Image( 'media/gui/stats.png' ),
	clockImage: 	new ig.Image( 'media/gui/clock.png' ),
	buyButtonsSheet: 	new ig.Image( 'media/gui/buy_buttons.png' ),
	shopSheet: 		new ig.Image( 'media/gui/shop.png' ),
	cpuSheet: 		new ig.Image( 'media/units/cpu.png' ),
	unitsSheet: 	new ig.Image( 'media/units/units.png' ),
	rulerSheet: 	new ig.Image( 'media/gui/ruler.png' ),
	spreadArmy: 	new ig.Image( 'media/gui/spread_army.png' ),
	spreadTerrain: 	new ig.Image( 'media/gui/spread_terrain.png' ),	
	tutorialImage: 	new ig.Image( 'media/gui/tutorial.png' ),

	// AUDIO
	sMenu: 			new ig.Sound( 'media/sounds/menu.*', false ),
	sOk: 			new ig.Sound( 'media/sounds/ok.*', false ),
	sMove: 			new ig.Sound( 'media/sounds/move.*', false ),
	sNoMoves: 		new ig.Sound( 'media/sounds/no_moves.*', false ),

	// SETTINGS
	debug: 				false,
	fun: 				false,
	
	STATE: 				'intro',
	turn: 				0,
	team: 				1,
	teams: 	[
		{
			ai: 		true,
			score: 		0,
			bitcoins: 	8,
			moves: 		4,
			timer: 		new ig.Timer()

		},{
			ai: 		true,
			score: 		0,
			bitcoins: 	8,
			moves: 		6,
			timer: 		new ig.Timer()
		}
	],
	timer: 				new ig.Timer(),	

	GUI: {
		leftTop: 		null,
		middleTop: 		null,
		rightTop: 		null,
		centerBottom: 	null,
		map: 			null,
		shop: {
			blue: 		null,
			red: 		null
		},
		labels: {
			start: 		'O', // O
			next: 		'O', // O
			_1: 		'U',//U
			_2: 		'Y',//Y
			_3: 		'A',//A
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
		btcFromCpu: 		2,
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
		},
		'game_over': {
			cursor: 		[],
			position: 		0	
		},
		'tutorial':{
			cursor: 		[],
			position: 		0	
		}
	},
	ai: 				true,
	sound: 				false,
	debug: 				false,


	init: function() {

		console.log('\n\nWelcom to the Bit Wars ['+this.version+']\n\nSource code: https://github.com/w84death/BitWars/\n\n--- \n(c)2014 Krzysztof Jankowski\n');

		// GUI

		this.GUI.leftTop = {x:16,y:8};
		this.GUI.centerTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-16,y:8};
		
		this.GUI.centerMiddle = {x:ig.system.width*0.5,y:ig.system.height*0.5};
		
		
		this.GUI.leftBottom = {x:16,y:ig.system.height-8};
		this.GUI.centerBottom = {x:ig.system.width*0.5,y:ig.system.height-8};
		this.GUI.rightBottom = {x:ig.system.width-16,y:ig.system.height-8};

		this.GUI.map = {x:ig.system.width*0.5,y:ig.system.height*0.5};
		this.GUI.shop.blue = {x:16,y:ig.system.height*0.5+12};
		this.GUI.shop.red = {x:ig.system.width-16,y:ig.system.height*0.5+12};


		// MENU
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y+12);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y+36);
		this.menu['menu'].cursor.push(this.GUI.centerMiddle.y+48);

		this.menu['map'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['map'].cursor.push(this.GUI.centerMiddle.y);
		this.menu['map'].cursor.push(this.GUI.centerMiddle.y+12);
		this.menu['map'].cursor.push(this.GUI.centerMiddle.y+36);

		this.menu['game_menu'].cursor.push(this.GUI.centerMiddle.y-12);
		this.menu['game_menu'].cursor.push(this.GUI.centerMiddle.y);
		this.menu['game_menu'].cursor.push(this.GUI.centerMiddle.y+12);

		this.menu['game_over'].cursor.push(this.GUI.centerMiddle.y);
		this.menu['game_over'].cursor.push(this.GUI.centerMiddle.y+12);

		this.menu['tutorial'].cursor.push(this.GUI.centerMiddle.y-12);

		//ig.input.bind( ig.KEY.MOUSE1, 'action' );	
		

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
		ig.input.bind( ig.KEY.L, 'extras' );

		// GAMEPAD

		ig.input.bind( ig.GAMEPAD.PAD_LEFT, 'left');
		ig.input.bind( ig.GAMEPAD.PAD_RIGHT, 'right');
		ig.input.bind( ig.GAMEPAD.PAD_TOP, 'up');
		ig.input.bind( ig.GAMEPAD.PAD_BOTTOM, 'down');

		ig.input.bind( ig.GAMEPAD.FACE_1, 'next_turn');
		ig.input.bind( ig.GAMEPAD.FACE_2, 'buy_3');
		ig.input.bind( ig.GAMEPAD.FACE_3, 'buy_1');
		ig.input.bind( ig.GAMEPAD.FACE_4, 'buy_2');

		ig.input.bind( ig.GAMEPAD.LEFT_SHOULDER, 'action');
		ig.input.bind( ig.GAMEPAD.RIGHT_SHOULDER, 'extras');		

/*
1 = O
2 = A
3 = U
4 = Y
*/
		// MUSIC LIST
		ig.music.add( 'media/music/menu.*', 'menu' );
		ig.music.add( 'media/music/game.*', 'game' );

		ig.music.volume = 0.7;
		ig.music.loop = true;

        // LOAD MENU

		if(this.sound) ig.music.play('menu');

		this.fontWhite.letterSpacing = -1;
        this.fontWhite.lineSpacing = -2;
        this.fontColor.letterSpacing = -1;
        this.fontColor.lineSpacing = -2;
        this.fontRed.letterSpacing = -1;
        this.fontRed.lineSpacing = -2;
        this.fontBlue.letterSpacing = -1;
        this.fontBlue.lineSpacing = -2;  

        this.teams[0].timer.reset();
		this.teams[0].timer.pause();
		this.teams[1].timer.reset();
		this.teams[1].timer.pause(); 

		// BACKGROUND

		ig.game.spawnEntity( EntityFuncy_background, 0, 0, {width:ig.system.width, height:ig.system.height} );					

		
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
				trees: params.trees,
				rocks: params.rocks,
				bases: params.bases
			}
		})
		this.map = newProceduralMap.get();
		this.map.pointZero = {
			x: this.GUI.map.x - (this.map.blueprint.width*8),
			y: this.GUI.map.y - (this.map.blueprint.height*8) + 8
		}
	},

	stateChange: function(state){
		if(this.sound) this.sOk.play();
		if ( this.STATE == 'intro' && state == 'menu' ){			
			this.STATE = 'menu';	
		}

		if ( this.STATE == 'menu' && state == 'tutorial' ){
			this.STATE = 'tutorial';
		}

		if ( this.STATE == 'tutorial' && state == 'menu' ){
			this.STATE = 'menu';
		}

		if ( this.STATE == 'menu' && state == 'map' ){
			if(this.menu['menu'].position === 3){
				this.sound = !this.sound;
				if(!this.sound){
					ig.music.stop();
				}
				if(this.sound){
					ig.music.play();
				}

				return
			}

			if(this.menu['menu'].position === 4){
				this.STATE = 'tutorial';
				return;				
			}						

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
			
			if(this.menu['map'].position === 3){
				this.STATE = 'menu';
				return;				
			}

			ig.music.stop();
			
			if(this.sound) ig.music.play('game');
			ig.music.volume = 0.4;
			var params = {};

			if(this.menu['map'].position === 0){
				params.width = 9;				
				params.height = 4;
				params.trees = 0.15;
				params.rocks = 0.05;
				params.bases = 2;		
			}
			if(this.menu['map'].position === 1){
				params.width = 11;				
				params.height = 5;
				params.trees = 0.2;
				params.rocks = 0.1;
				params.bases = 4;
			}
			if(this.menu['map'].position === 2){
				params.width = 13;				
				params.height = 7;
				params.trees = 0.3;
				params.rocks = 0.1;
				params.bases = 4;
			}		

			this.STATE = 'game';
			this.ai = new ig.AI();					
			this.proceduralMap(params);
			this.loadMap();	
			this.teams[this.team-1].timer.unpause();					
		}

		if ( this.STATE == 'game' && state == 'game_menu' ){			
			this.menu['game_menu'].position = 0;
			this.teams[this.team-1].timer.pause();
			this.STATE = 'game_menu';
		}

		if ( this.STATE == 'game_menu' && state == 'game' ){
			this.teams[this.team-1].timer.unpause();
			this.STATE = 'game';
		}

		if ( this.STATE == 'game' && state == 'game_over' ){
			this.STATE = 'game_over';
			if(this.sound) ig.music.fadeOut( 1 )
			this.teams[this.team-1].timer.pause();
		}

		if ( (this.STATE == 'game_over' && state == 'menu') || (this.STATE == 'game_menu' && state == 'menu') ){
			if(this.sound) ig.music.play('menu');
			ig.music.volume = 0.7;
			// clear game
			this.ai = null;								
			this.unloadMap();

			this.STATE = 'menu';
		}

		if( (this.STATE == 'game_menu' || this.STATE == 'game_over') && state == 'restart'){
			this.ai = null;								
			this.unloadMap();

			this.STATE = 'game';
			this.ai = new ig.AI();					
			this.loadMap();	
		}
	},

	unloadMap: function(){
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].kill();
		}		
		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				this.map.units[x][y] = null;
			}
		}
			
		this.turn = 0;
		this.team = 1;
		this.teams[0].score = 0;
		this.teams[0].bitcoins = 8;
		this.teams[0].moves = 4;
		this.teams[0].timer.reset();
		this.teams[0].timer.pause();
		this.teams[1].score = 0;
		this.teams[1].bitcoins = 8;
		this.teams[1].moves = 4;
		this.teams[1].timer.reset();
		this.teams[1].timer.pause();
		this.timer.set(0);

	},

	loadMap: function(){	
		var newX 	= 0, 
			newY 	= 0,
			name 	= '';

		// reset rulers
		this.ruler = [2,this.map.blueprint.width-3];

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

		this.teams[this.team-1].bitcoins += this.settings.btcPerTurn;

		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				if(this.map.terrain[x][y].base){
					base = this.getEntityByName(this.map.terrain[x][y].name);
					if(base.team === this.team){
						this.teams[this.team-1].bitcoins += this.settings.btcFromBase;
					}
				}
			}
		}
	},

	spawnCpu: function(){
		var empty = [],
			random, name;

		for (var x = 0; x < this.map.blueprint.width; x++) {			
			for (var y = 0; y < this.map.blueprint.height; y++) {
				if(this.map.terrain[x][y].type === 0 && !this.map.units[x][y]){
					empty.push({x:x,y:y});
				}
			}
		}
		
		if(empty.length > 0){
			random = (Math.random()*empty.length)<<0,
			name = 'cpu_'+Math.random().toString();
			ig.game.spawnEntity( EntityCpu, this.map.pointZero.x + (empty[random].x*16), this.map.pointZero.y + (empty[random].y*16), {name:name} );
			this.map.units[empty[random].x][empty[random].y] = name;
		}
	},

	nextTurn: function(){

		if(this.teams[0].score >= this.map.blueprint.height || this.teams[1].score >= this.map.blueprint.height){
			// GAME OVER
			this.stateChange('game_over');
			return;
		}

		this.teams[this.team-1].timer.pause();
		this.giveBTCtoPlayers();
		this.team += 1;
		if(this.team > 2) {
			this.team = 1;
			this.turn += 1;			
			this.teams[0].moves += 1;
			this.teams[1].moves += 1;

			if(this.turn % 5 == 0){
				this.spawnCpu();
			}
		}		
		if(this.teams[this.team-1].ai){
			this.ai.unlock();
		}
		this.teams[this.team-1].timer.unpause();
	},

	moveUnits: function(){
		var unit = false,
			unitsMoving = false,
			base = null,
			enemy = null,
			targetX = false;
			
		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				// if there is a unit?
				if(this.map.units[x][y]){
					// get unit object
					unit = this.getEntityByName(this.map.units[x][y]);
					
					// my unit and have moves left?
					if(unit.turn === this.turn && unit.team === this.team){
						
						// and it's not a fking flag
						if(!unit.flag){

							// unit waits for orders
							if(unit.target === false){
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
											unit.target = false;
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
									unit.target = false;
									unit.willAttack = false;
									unit.turn = this.turn + 1;
									unit.vel.x = 0;
								}							
							}
						}	
						
						// unit have a target and wants to move
						if(unit.target !== false){
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
								

								// if there is an enemy?
								if( unit.willAttack && this.map.units[unit.target][y]){
									enemy = this.getEntityByName(this.map.units[unit.target][y]);
									
									// FIGHT!
									if(enemy.power < unit.power){
										// win
										enemy.kill();											
										this.map.units[unit.target][y] = false;
										unit.willAttack = false;
										unit.willCapture = false;									
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



								if(unit.target !== false){									
									if((unit.team === 2 && unit.target < 1) || (unit.team === 1 && unit.target > (this.map.blueprint.width-2)) ){									
										
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
									}
								}

								// move the unit in the map data
								if(unit.target !== false){							
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
			if(unit && unit.team !== this.team && !unit.cpu){
				unitsInRow += 1;
			}
		}
		
		if(unitsInRow == 0){
			if(this.teams[this.team-1].moves > 0){
				this.teams[this.team-1].moves -= 1;
			}else{
				if(!this.teams[this.team-1].ai && this.sound) this.sNoMoves.play();
				return;
			}
		}

		if(params.up && unitsInRow == 0){
			if(!this.teams[this.team-1].ai && this.sound) this.sMove.play();
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
			if(!this.teams[this.team-1].ai && this.sound) this.sMove.play();
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
			if(params.setRow > 0 && params.setRow < this.map.blueprint.width-1){
				this.ruler[this.team-1] = params.setRow;
			}else{
				return;
			}
		}

		if(params.right){
			this.ruler[this.team-1] += 1;
			if(this.ruler[this.team-1] > this.map.blueprint.width-2){
				this.ruler[this.team-1] = 1;
			}			
			if(this.sound) this.sMenu.play();
		}
		if(params.left){
			this.ruler[this.team-1] -= 1;
			if(this.ruler[this.team-1] < 1){
				this.ruler[this.team-1] = this.map.blueprint.width-2;
			}
			if(this.sound) this.sMenu.play();
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
		if(this.sound) this.sMenu.play();
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
	},	

	update: function() {		
		this.parent();

		if(this.STATE == 'intro'){
			
			if(ig.input.released('action') || ig.input.released('next_turn')){
				this.stateChange('menu');				
				return;
			}
		}

		if(this.STATE == 'menu' || this.STATE == 'map' || this.STATE == 'game_menu' || this.STATE == 'game_over'){
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
					if(this.menu['game_menu'].position === 2){
						this.stateChange('restart');				
					}
				}
				if(this.STATE == 'game_over'){
					if(this.menu['game_over'].position === 0){
						this.stateChange('restart');				
					}
					if(this.menu['game_over'].position === 1){
						this.stateChange('menu');					
					}
				}			
				return;
			}
		}
		
		if(this.STATE == 'tutorial'){
			if(ig.input.released('action') || ig.input.released('next_turn')){
				this.stateChange('menu');
			}
		}

		if(this.STATE == 'game'){
			// AI turn?
			if(ig.input.released('action')){
				this.stateChange('game_menu');
			}else
			if(ig.input.released('extras')){
				this.debug = !this.debug;
				this.spawnCpu();
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
			this.fontWhite.draw('Version '+this.version, this.GUI.centerTop.x, this.GUI.centerTop.y+28, ig.Font.ALIGN.CENTER );

			this.heroesImage.drawTile(this.GUI.centerMiddle.x-72, this.GUI.centerMiddle.y-8,1,30,28);
			this.heroesImage.drawTile(this.GUI.centerMiddle.x+42, this.GUI.centerMiddle.y-8,0,30,28);			

			if( (this.timer.delta()*3).toFixed(0) % 2 == 0){
				this.fontOUYA.draw('PRESS '+this.GUI.labels.start, this.GUI.centerMiddle.x, this.GUI.centerMiddle.y+4, ig.Font.ALIGN.CENTER );
			}
			this.fontColor.draw('Game design & code: Krzysztof Jankowski', this.GUI.centerBottom.x, this.GUI.centerBottom.y-34, ig.Font.ALIGN.CENTER );
			this.fontColor.draw('Music: NoSoapRadio', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontColor.draw('(c) 2014 P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
		}	

		if(this.STATE == 'menu' || this.STATE == 'map'){
			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);

			
			if(this.STATE == 'map'){
				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('SMALL 9x4 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('SMALL 9x4 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('NORMAL 11x5 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('NORMAL 11x5 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 2){
					this.fontColor.draw('BIG 13x7 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('BIG 13x7 MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 3){
					this.fontColor.draw('BACK', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('BACK', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
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
				
				if(this.menu[this.STATE].position == 3){
					if(this.sound){
						this.fontColor.draw('SOUND: ON', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
					}else{
						this.fontColor.draw('SOUND: OFF', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
					}
				}else{
					if(this.sound){
						this.fontWhite.draw('SOUND: ON', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
					}else{
						this.fontWhite.draw('SOUND: OFF', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[3], ig.Font.ALIGN.CENTER );
					}
				}

				if(this.menu[this.STATE].position == 4){
					this.fontColor.draw('HOW TO PLAY', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[4], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('HOW TO PLAY', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[4], ig.Font.ALIGN.CENTER );
				}
				
			}			
		}	

		if(this.STATE == 'tutorial'){
			
			this.fontColor.draw('BACK', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
			
			this.fontWhite.draw('HERE WILL BE MUCH BETTER TUTORIAL IN THE FUTURE', this.GUI.centerTop.x, this.GUI.centerTop.y, ig.Font.ALIGN.CENTER );

			this.spreadArmy.draw(this.GUI.centerMiddle.x - 140, this.GUI.centerMiddle.y-65);
			this.tutorialImage.draw(this.GUI.centerMiddle.x + 45, this.GUI.centerMiddle.y-56);			
			this.spreadTerrain.draw(this.GUI.centerBottom.x - 56, this.GUI.centerBottom.y - 70);
		}

		if(this.STATE == 'game' || this.STATE == 'move' || this.STATE == 'game_menu' || this.STATE == 'game_over'){			
			this.renderMapFrame();

			// CENTER STATS
			this.fontWhite.draw('SUMMER', this.GUI.centerTop.x, this.GUI.centerTop.y, ig.Font.ALIGN.CENTER );					
			this.fontWhite.draw('TURN - ' + this.turn, this.GUI.centerTop.x, this.GUI.centerTop.y+10, ig.Font.ALIGN.CENTER );					
			if(this.team === 1){
				this.fontBlue.draw('TEAM BLUE TURN', this.GUI.centerTop.x, this.GUI.centerTop.y+20, ig.Font.ALIGN.CENTER );						
			}else{
				this.fontRed.draw('TEAM RED TURN', this.GUI.centerTop.x, this.GUI.centerTop.y+20, ig.Font.ALIGN.CENTER );		
				
			}

			// TEAMS STATS
			for (var i = 0; i < 2; i++) {
				newX = i === 0 ? this.GUI.leftTop.x : this.GUI.rightTop.x-40,
				newY = i === 0 ? this.GUI.leftTop.y : this.GUI.rightTop.y;
			
				this.statsSheet.drawTile(newX,newY,i,40,50);
				this.fontWhite.draw((i===0 ? 'BLUE' : 'RED'), newX+20, newY+1, ig.Font.ALIGN.CENTER );			

				this.fontWhite.draw('FLAG: '+ this.teams[i].score, newX+34, newY+12, ig.Font.ALIGN.RIGHT );
				
				this.clockImage.draw(newX+5, newY+24);
				timeM = (this.teams[i].timer.delta() / 60 )<<0;
				timeS = ("00" + ( this.teams[i].timer.delta().toFixed(0) - (timeM*60) )).slice (-2);
				this.fontWhite.draw(timeM+':'+timeS, newX+34, newY+24, ig.Font.ALIGN.RIGHT );							
				
				this.cpuSheet.drawTile(newX+2, newY+30,0,16,16);
				this.fontWhite.draw(this.teams[i].bitcoins.toFixed(1), newX+34, newY+36, ig.Font.ALIGN.RIGHT );
				
			};
				

			if(this.STATE == 'game'){
				var newX, newY;	

				newX = this.team === 1 ? this.GUI.shop.blue.x : this.GUI.shop.red.x-40,
				newY = this.team === 1 ? this.GUI.shop.blue.y : this.GUI.shop.red.y;
											
				this.shopSheet.drawTile(newX,newY-35,this.team-1,40,70);
				this.fontWhite.draw('SHOP', newX+20, newY-34, ig.Font.ALIGN.CENTER );

				this.buyButtonsSheet.drawTile(newX+4,newY-22,this.team-1,32,16);
				this.buyButtonsSheet.drawTile(newX+4,newY-4,this.team-1,32,16);
				this.buyButtonsSheet.drawTile(newX+4,newY+14,this.team-1,32,16);			

				this.unitsSheet.drawTile(newX+6, newY-3-22, this.team === 1 ? 0 : 3, 16, 16);
				this.unitsSheet.drawTile(newX+6, newY-3-4, this.team === 1 ? 6 : 9, 16, 16);
				this.unitsSheet.drawTile(newX+6, newY-3+14, this.team === 1 ? 12 : 16, 16, 16);

				this.fontOUYA.draw(this.GUI.labels._1, newX+6, newY+9-22, ig.Font.ALIGN.CENTER );		
				this.fontOUYA.draw(this.GUI.labels._2, newX+6, newY+9-4, ig.Font.ALIGN.CENTER );		
				this.fontOUYA.draw(this.GUI.labels._3, newX+6, newY+9+14, ig.Font.ALIGN.CENTER );


				if(this.settings.prices.soldier <= this.teams[this.team-1].bitcoins){
					this.fontWhite.draw(this.settings.prices.soldier, newX+28, newY+2-22, ig.Font.ALIGN.CENTER );
				}else{
					this.fontColor.draw(this.settings.prices.soldier, newX+28, newY+2-22, ig.Font.ALIGN.CENTER );
				}

				if(this.settings.prices.tank <= this.teams[this.team-1].bitcoins){	
					this.fontWhite.draw(this.settings.prices.tank, newX+28, newY+2-4, ig.Font.ALIGN.CENTER );	
				}else{
					this.fontColor.draw(this.settings.prices.tank, newX+28, newY+2-4, ig.Font.ALIGN.CENTER );	
				}

				if(this.settings.prices.helicopter <= this.teams[this.team-1].bitcoins){	
					this.fontWhite.draw(this.settings.prices.helicopter, newX+28, newY+2+14, ig.Font.ALIGN.CENTER );
				}else{
					this.fontColor.draw(this.settings.prices.helicopter, newX+28, newY+2+14, ig.Font.ALIGN.CENTER );
				}
				
				newX = (this.team === 1 ? this.GUI.shop.blue.x + 21 : this.GUI.shop.red.x - 21);
				newY = (this.team === 1 ? this.GUI.shop.blue.y + 40 : this.GUI.shop.red.y + 40);
				this.buyButtonsSheet.drawTile(newX-16,newY,this.team-1,32,16);						
				this.fontOUYA.draw(this.GUI.labels.next, newX-14, newY+9, ig.Font.ALIGN.CENTER );										
				this.fontWhite.draw('DONE', newX, newY+3, ig.Font.ALIGN.CENTER );
				this.drawRuler();

				// FOLLOW THE RABBIT!
				if(this.team === 1){
					this.fontBlue.draw(this.teams[0].moves, (this.ruler[0] * 16 ) + this.map.pointZero.x, this.map.pointZero.y + (this.map.blueprint.height*16)+8, ig.Font.ALIGN.CENTER );					
				}else{
					this.fontRed.draw(this.teams[1].moves, (this.ruler[1] * 16 ) + this.map.pointZero.x, this.map.pointZero.y + (this.map.blueprint.height*16)+8, ig.Font.ALIGN.CENTER );
				}


				if(this.debug){		
					if(this.teams[this.team-1].ai){	
						for (var x = 0; x < ig.game.map.blueprint.width; x++) {
							for (var y = 0; y < ig.game.map.blueprint.height; y++) {													
								if(this.ai.heatMap.length > 0){
									this.fontWhite.draw(this.ai.heatMap[x][y], this.map.pointZero.x + (x*16) + 8, this.map.pointZero.y + (y*16) + 4, ig.Font.ALIGN.CENTER );		
								}
							}
						};
					}
				}
			}


			if(this.STATE == 'game_over'){

				this.fontWhite.draw('TEAM '+ ( this.teams[0].score > this.teams[1].score ? 'BLUE' : 'RED' ) + ' WINS!', this.GUI.centerMiddle.x, this.GUI.centerMiddle.y-24, ig.Font.ALIGN.CENTER );		
				
				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('PLAY AGAIN', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('PLAY AGAIN', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('BACK TO MENU', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('BACK TO MENU', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
			}

			if(this.STATE == 'game_menu'){

				if(this.menu[this.STATE].position == 0){
					this.fontColor.draw('RESUME GAME', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('RESUME GAME', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[0], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 1){
					this.fontColor.draw('SURRENDER', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('SURRENDER', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[1], ig.Font.ALIGN.CENTER );
				}
				if(this.menu[this.STATE].position == 2){
					this.fontColor.draw('RESTART MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}else{
					this.fontWhite.draw('RESTART MAP', this.GUI.centerMiddle.x, this.menu[this.STATE].cursor[2], ig.Font.ALIGN.CENTER );
				}
				
			}			
		}		

		this.renderCorners();
	}
});

	var w = 320,
		h = 180,
		z = 3,
		fps = 60;

	//if( ig.ua.mobile ) {
		//ig.Sound.enabled = false;
	//}
	ig.Sound.channels = 16;

	var c = document.createElement('canvas');
  	c.id = 'canvas';
  	document.body.appendChild(c);

	ig.main( '#canvas', MyGame, fps, w, h, z);

});