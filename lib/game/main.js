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
	'impact.debug.debug',
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

	// ARMY
	'game.entities.army',
	'game.entities.soldier_blue',
	'game.entities.soldier_red',
	'game.entities.tank_blue',
	'game.entities.tank_red',
	'game.entities.helicopter_blue',
	'game.entities.helicopter_red'
)
.defines(function(){

MyGame = ig.Game.extend({

	// VER
	version: 		'pre-Alpha 0.02',
	// GFX
	clearColor: 	'#b2dcef',	
	fontColor: 			new ig.Font( 'media/font/colors.png' ),
	logoImage: 		new ig.Image( 'media/gfx/logo.png' ),
	heroesImage: 	new ig.Image( 'media/gfx/heroes.png' ),

	// AUDIO
	//sMenu: 			new ig.Sound( 'media/sounds/menu.*', false ),

	// SETTINGS
	debug: 						false,
	
	STATE: 						'intro',
	timer: 						new ig.Timer(),	

	GUI: {
		leftTop: 		null,
		middleTop: 		null,
		rightTop: 		null,
		centerBottom: 	null,
		map: 			null,
	},

	map: 				{},
	proceduralMap: 		{},


	init: function() {

		console.log('\n\nWelcom to the Bit Wars ['+this.version+']\n\nSource code: https://github.com/w84death/BitWars/\n\n--- \n(c)2014 Krzysztof Jankowski\n');

		// GUI

		this.GUI.leftTop = {x:8,y:8};
		this.GUI.centerTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-8,y:8};
		this.GUI.centerBottom = {x:ig.system.width*0.5,y:ig.system.height-8};
		this.GUI.map = {x:ig.system.width*0.5,y:ig.system.height*0.5};
		
		ig.input.bind( ig.KEY.MOUSE1, 'touch' );	
		

		// KEYS
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.X, 'attack' );
		ig.input.bind( ig.KEY.S, 'defence' );

		ig.input.bind( ig.KEY.ENTER, 'action' );
		ig.input.bind( ig.KEY.M, 'quest' );

		ig.input.bind( ig.KEY.F, 'secretA' );
		ig.input.bind( ig.KEY.J, 'secretB' );

		// GAMEPAD
		Gamepad.mappings.one = [
	        [ 'dpadUp', 'up' ],
	        [ 'dpadDown', 'down' ],
	        [ 'dpadLeft', 'left' ],
	        [ 'dpadRight', 'right' ],
	        [ 'leftStickX', 'left', 'right' ],
	        [ 'leftStickY', 'up', 'down' ],
	        [ 'faceButton0', 'attack' ],
	        [ 'faceButton1', 'defence' ],
	        [ 'faceButton2', 'action' ],
	        [ 'faceButton3', 'action4' ]
	    ];

		// MUSIC LIST
		//ig.music.add( 'media/music/menu.mp3' );
		//ig.music.volume = 0.7;

        // LOAD MENU
		//this.loadLevel( LevelTest );
		//ig.music.play();

		this.fontColor.letterSpacing = -1;
        this.fontColor.lineSpacing = -2;
	},	

	// MAP
	proceduralMap: function(){
		var newProceduralMap = new ig.ProceduralMap();
		newProceduralMap.generate({
			prefs: {
				width: 16,
				height: 8,
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
			y: this.GUI.map.y - (this.map.blueprint.height*8) + 16
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
			}
		}
	},

	spawnArmy: function(){
		var newX, newY;

		newX = this.map.pointZero.x;
		newY = this.map.pointZero.y + ((Math.random()*(this.map.blueprint.height-1)*16)<<0);

		ig.game.spawnEntity( EntitySoldier_blue, newX, newY );
	},

	// UPDATE
	update: function() {		
		this.parent();

		if(this.STATE == 'intro'){
			if(ig.input.released('action') || ig.input.state('touch')){
				this.stateChange('newGame');				
				return;
			}
		}

		if(this.STATE == 'game'){
			if(ig.input.released('action') || ig.input.state('touch')){
				this.spawnArmy();
			}
		}
	},	

	// DRAW
	draw: function() {
		this.parent();

		if(this.STATE == 'intro'){

			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);
			this.heroesImage.draw(this.GUI.centerTop.x-30, this.GUI.centerTop.y+48);

			this.fontColor.draw('Version '+this.version, this.GUI.centerBottom.x, this.GUI.centerBottom.y-60, ig.Font.ALIGN.CENTER );

			if( this.timer.delta().toFixed(0) % 2 != 0){
				this.fontColor.draw('PRESS ENTER', this.GUI.centerBottom.x, this.GUI.centerBottom.y-48, ig.Font.ALIGN.CENTER );
			}
			this.fontColor.draw('Game design & code: Krzysztof Jankowski', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontColor.draw('(c) 2014 P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
		}

		
		if(this.STATE == 'game'){
			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y-2);
		}
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