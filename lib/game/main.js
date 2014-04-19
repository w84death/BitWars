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
	'plugins.procedural-map',
	'plugins.gamepad',
	//'plugins.touch-button',

	// LEVELS
	'game.levels.test',
	//'game.levels.menu',
	//'game.levels.menuhd',
	//'game.levels.intro',
	/*'game.levels.arena',
	'game.levels.forest',
	'game.levels.rocks',
	'game.levels.bricks',*/

	// TERRAIN
	'game.entities.terrain',
	'game.entities.grass',
	'game.entities.tree',
	'game.entities.rock',
	'game.entities.grass_left',
	'game.entities.grass_right',

	// ARMY
	'game.entities.unit',
	'game.entities.soldier_blue',
	'game.entities.soldier_red',
	'game.entities.tank_blue',
	'game.entities.tank_red',
	'game.entities.helicopter_blue',
	'game.entities.helicopter_red',

	// ITEMS
	'game.entities.flag',
	'game.entities.flag_red',
	'game.entities.flag_blue'
)
.defines(function(){

MyGame = ig.Game.extend({

	// VER
	version: 		'pre-Alpha 0.03',
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

	// AUDIO
	//sMenu: 			new ig.Sound( 'media/sounds/menu.*', false ),

	// SETTINGS
	debug: 				false,
	
	STATE: 				'intro',
	turn: 				0,
	team: 				1,
	timer: 				new ig.Timer(),	

	GUI: {
		leftTop: 		null,
		middleTop: 		null,
		rightTop: 		null,
		centerBottom: 	null,
		map: 			null,
	},

	map: 				{},
	units: 				{},


	init: function() {

		console.log('\n\nWelcom to the Bit Wars ['+this.version+']\n\nSource code: https://github.com/w84death/BitWars/\n\n--- \n(c)2014 Krzysztof Jankowski\n');

		// GUI

		this.GUI.leftTop = {x:16,y:8};
		this.GUI.centerTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-16,y:8};
		this.GUI.centerBottom = {x:ig.system.width*0.5,y:ig.system.height-8};
		this.GUI.map = {x:ig.system.width*0.5,y:ig.system.height*0.5};
		
		ig.input.bind( ig.KEY.MOUSE1, 'touch' );	
		

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
		Gamepad.mappings.one = [
	        [ 'dpadUp', 'up' ],
	        [ 'dpadDown', 'down' ],
	        [ 'dpadLeft', 'left' ],
	        [ 'dpadRight', 'right' ],
	        [ 'leftStickX', 'left', 'right' ],
	        [ 'leftStickY', 'up', 'down' ],
	        [ 'faceButton0', 'action' ],
	        [ 'faceButton1', 'buy_1' ],
	        [ 'faceButton2', 'buy_2' ],
	        [ 'faceButton3', 'buy_3' ]
	    ];

		// MUSIC LIST
		//ig.music.add( 'media/music/menu.mp3' );
		//ig.music.volume = 0.7;

        // LOAD MENU
		//this.loadLevel( LevelTest );
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
	proceduralMap: function(){
		var newProceduralMap = new ig.ProceduralMap();
		newProceduralMap.generate({
			prefs: {
				width: 14,
				height: 6,
				season: 'summer'
			},			
			dna: {
				trees: 0.1,
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
		if ( this.STATE == 'intro' && state == 'newGame' ){
			this.STATE = 'game';
			this.proceduralMap();
			this.loadMap();						
		}
	},

	loadMap: function(){	
		var newX 	= 0, 
			newY 	= 0;


		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {				
				
				newX = (x*16) + this.map.pointZero.x;
				newY = (y*16) + this.map.pointZero.y;

				if(this.map.terrain[x][y] === 0){
					ig.game.spawnEntity( EntityGrass, newX, newY );
				}

				if(this.map.terrain[x][y] === 1){
					ig.game.spawnEntity( EntityTree, newX, newY );
				}

				if(this.map.terrain[x][y] === 2){
					ig.game.spawnEntity( EntityRock, newX, newY );
				}
				if(this.map.terrain[x][y] === 3){
					ig.game.spawnEntity( EntityGrass_left, newX, newY );
				}
				if(this.map.terrain[x][y] === 4){
					ig.game.spawnEntity( EntityGrass_right, newX, newY );
				}
			}
		}		
	},	

	buyUnit: function(params){
		var x, y, newX, newY, name, 
			spots = [];

		for (var y = 0; y < this.map.blueprint.height; y++) {
			if(params.team === 1 && !this.map.units[0][y]){
				spots.push(y);
			}			
			if(params.team === 2 && !this.map.units[this.map.blueprint.width-1][y]){
				spots.push(y);
			}
		};		

		if(spots.length < 1) return;

		if(params.flag){
			x = params.team === 1 ? this.map.blueprint.width-1 : 0;	
			y = params.pos;
		}else{
			x = params.team === 1 ? 0 : this.map.blueprint.width -1;
			y = spots[(Math.random()*(spots.length))<<0];	
		}		
		
		newX = this.map.pointZero.x + ( x * 16 );
		newY = this.map.pointZero.y + ( y * 16);
		name = 'unit_'+Math.random().toString();

		if(params.team === 1){
			if(params.soldier){
				ig.game.spawnEntity( EntitySoldier_blue, newX, newY, { name: name, turn:this.turn+1} );			
			}else
			if(params.tank){
				ig.game.spawnEntity( EntityTank_blue, newX, newY, { name: name, turn:this.turn+1} );
			}else
			if(params.helicopter){
				ig.game.spawnEntity( EntityHelicopter_blue, newX, newY, { name: name, turn:this.turn+1} );
			}else	
			if(params.flag){
				ig.game.spawnEntity( EntityFlag_blue, newX, newY, { name: name, turn:this.turn+1} );
			}		
		}		
		if(params.team === 2){
			if(params.soldier){
				ig.game.spawnEntity( EntitySoldier_red, newX, newY, { name: name, turn:this.turn+1} );
			}else
			
			if(params.tank){
				ig.game.spawnEntity( EntityTank_red, newX, newY, { name: name, turn:this.turn+1} );
			}else
				
			if(params.helicopter){
				ig.game.spawnEntity( EntityHelicopter_red, newX, newY, { name: name, turn:this.turn+1} );
			}
			
			if(params.flag){
				ig.game.spawnEntity( EntityFlag_red, newX, newY, { name: name, turn:this.turn+1} );
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

	nextTurn: function(){		
		this.team += 1;
		if(this.team > 2) {
			this.team = 1;
			this.turn += 1;
		}		
	},

	moveUnits: function(){
		var unit = false,
			unitsMoving = false;

		for (var x = 0; x < this.map.blueprint.width; x++) {
			for (var y = 0; y < this.map.blueprint.height; y++) {
				if(this.map.units[x][y]){
					unit = this.getEntityByName(this.map.units[x][y]);
					
					if(unit.turn == this.turn && unit.team === this.team){
						if(!unit.flag){
							if(!unit.target){
								if(unit.team === 1){
									if(!this.map.units[x+1][y]){
										unit.target = x + 1;
									}else{
										unit.target = -999;
										unit.attack = true;
									}
								}
								if(unit.team === 2){
									if(!this.map.units[x-1][y]){
										unit.target = x - 1;
									}else{
										unit.target = -999;
										unit.attack = true;
									}
								}
							}
						}	

						if(unit.target > -1){
							if(unit.team === 1 && this.map.pointZero.x + (unit.target * 16) > unit.pos.x){
								unit.vel.x = unit.speed;
								unitsMoving = true;
							}else
							if(unit.team === 2 && this.map.pointZero.x + (unit.target * 16) < unit.pos.x){
								unit.vel.x = -unit.speed;
								unitsMoving = true;							
							}else{						
								if((unit.team === 2 && unit.target < 1) || (unit.team === 1 && unit.target > (this.map.blueprint.width-2))){									
									
									this.buyUnit({
										team: 	unit.team,
										flag: 	true,
										pos: 	y
									});

									this.map.units[x][y] = false;									
									unit.target = false;									
									unit.kill();
									
								}else{
									unit.name = this.map.units[x][y];
									this.map.units[unit.target][y] = this.map.units[x][y];
									this.map.units[x][y] = false;									
									unit.target = false;
									unit.turn = this.turn + 1;
									unit.vel.x = 0;
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
		}

	},

	update: function() {		
		this.parent();
		
		if(this.STATE == 'intro'){
			if(ig.input.released('action') || ig.input.state('touch')){
				this.stateChange('newGame');				
				return;
			}
		}

		if(this.STATE == 'game'){
			if(ig.input.released('buy_1')){
				this.buyUnit({
					soldier:true,
					team:1
				});
				this.buyUnit({
					soldier:true,
					team:2					
				});
			}
			if(ig.input.released('buy_2')){
				this.buyUnit({
					tank:true,
					team:1					
				});
				this.buyUnit({
					tank:true,
					team:2					
				});
			}
			if(ig.input.released('buy_3')){
				this.buyUnit({
					helicopter:true,
					team:1					
				});
				this.buyUnit({
					helicopter:true,
					team:2					
				});
			}
			if(ig.input.released('next_turn')){
				this.STATE = 'move';	
			}
		}

		if(this.STATE == 'move'){
			this.moveUnits();
		}
	},	

	// DRAW
	draw: function() {		
		
		
		this.parent();
		
		if(this.STATE == 'intro'){

			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);
			this.heroesImage.draw(this.GUI.centerTop.x-30, this.GUI.centerTop.y+48);

			this.fontWhite.draw('Version '+this.version, this.GUI.centerBottom.x, this.GUI.centerBottom.y-60, ig.Font.ALIGN.CENTER );

			if( this.timer.delta().toFixed(0) % 2 != 0){
				this.fontWhite.draw('PRESS ENTER', this.GUI.centerBottom.x, this.GUI.centerBottom.y-48, ig.Font.ALIGN.CENTER );
			}
			this.fontColor.draw('Game design & code: Krzysztof Jankowski', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontColor.draw('(c) 2014 P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
		}

		if(this.STATE == 'game' || this.STATE == 'move' || this.STATE == 'terrain'){			
			this.renderMapFrame();	
			this.fontBlue.draw('BLUE SCORE - 2', this.GUI.leftTop.x, this.GUI.leftTop.y, ig.Font.ALIGN.LEFT );		
			this.fontBlue.draw('MOVES - ######', this.GUI.leftTop.x, this.GUI.leftTop.y+12, ig.Font.ALIGN.LEFT );		
			this.fontBlue.draw('BITCOINS - 7.2', this.GUI.leftTop.x, this.GUI.leftTop.y+24, ig.Font.ALIGN.LEFT );		
			this.fontRed.draw('RED SCORE - 3', this.GUI.rightTop.x, this.GUI.rightTop.y, ig.Font.ALIGN.RIGHT );		
			this.fontRed.draw('### - MOVES', this.GUI.rightTop.x, this.GUI.rightTop.y+12, ig.Font.ALIGN.RIGHT );		
			this.fontRed.draw('3.6 - BITCOINS', this.GUI.rightTop.x, this.GUI.rightTop.y+24, ig.Font.ALIGN.RIGHT );		
			
			this.fontWhite.draw('SUMMER', this.GUI.centerTop.x, this.GUI.centerTop.y, ig.Font.ALIGN.CENTER );					
			this.fontWhite.draw('TURN - ' + this.turn, this.GUI.centerTop.x, this.GUI.centerTop.y+12, ig.Font.ALIGN.CENTER );		
			this.fontWhite.draw('TEAM - ' + this.team, this.GUI.centerTop.x, this.GUI.centerTop.y+24, ig.Font.ALIGN.CENTER );		
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