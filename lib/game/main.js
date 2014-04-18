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

	// LEVELS
	'game.levels.test',
	//'game.levels.menu',
	//'game.levels.menuhd',
	//'game.levels.intro',
	/*'game.levels.arena',
	'game.levels.forest',
	'game.levels.rocks',
	'game.levels.bricks',*/

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
	version: 		'pre-Alpha 0.01',
	// GFX
	clearColor: 	"#b2dcef",
	fontWhite: 		new ig.Font( 'media/font/white.png' ),
	fontColors: 	new ig.Font( 'media/font/colors.png' ),
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
	},
	proceduralMap: {},


	init: function() {

		console.log('\n\nWelcom to the Bit Wars ['+this.version+']\n\nSource code: https://github.com/w84death/BitWars/\n\n--- \n(c)2014 Krzysztof Jankowski\n');

		// GUI

		this.GUI.leftTop = {x:8,y:8};
		this.GUI.centerTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-8,y:8};
		this.GUI.centerBottom = {x:ig.system.width*0.5,y:ig.system.height-8};

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
	},	

	update: function() {		
		this.parent();

		if(this.STATE == 'intro'){
			if(ig.input.released('action')){
				this.loadLevel( LevelTest );
				this.STATE = 'game';
				return;
			}
		}

		if(this.STATE == 'game'){

			
		}
	},	

	draw: function() {
		this.parent();

		if(this.STATE == 'intro'){

			this.logoImage.draw(this.GUI.centerTop.x-24, this.GUI.centerTop.y+6);
			this.heroesImage.draw(this.GUI.centerTop.x-30, this.GUI.centerTop.y+48);

			this.fontColors.draw('Version '+this.version, this.GUI.centerBottom.x, this.GUI.centerBottom.y-60, ig.Font.ALIGN.CENTER );

			if( this.timer.delta().toFixed(0) % 2 != 0){
				this.fontColors.draw('PRESS ENTER', this.GUI.centerBottom.x, this.GUI.centerBottom.y-48, ig.Font.ALIGN.CENTER );
			}
			this.fontColors.draw('Game design & code: Krzysztof Jankowski', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontColors.draw('(c) 2014 P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
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