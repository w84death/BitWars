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
	'game.entities.tank_red'
)
.defines(function(){

MyGame = ig.Game.extend({

	// GFX
	clearColor: 	"#b2dcef",
	fontWhite: 		new ig.Font( 'media/font/white.png' ),
	fontBlack: 		new ig.Font( 'media/font/black.png' ),
	logoImage: 		new ig.Image( 'media/gfx/logo.png' ),

	// AUDIO
	//sMenu: 			new ig.Sound( 'media/sounds/menu.*', false ),

	// SETTINGS
	debug: 						false,
	
	STATE: 						'game',
	timer: 						new ig.Timer(),	

	GUI: {
		leftTop: 		null,
		middleTop: 		null,
		rightTop: 		null,
	},
	proceduralMap: {},


	init: function() {

		// GUI

		this.GUI.leftTop = {x:8,y:8};
		this.GUI.middleTop = {x:ig.system.width*0.5,y:8};
		this.GUI.rightTop = {x:ig.system.width-8,y:8};

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
		this.loadLevel( LevelTest );
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

			this.logoBig.draw(this.GUI.centerTop.x-89, this.GUI.centerMiddle.y+6);

			if( this.timer.delta().toFixed(0) % 2 != 0){
				this.fontBlack.draw('PRESS START', this.GUI.centerBottom.x, this.GUI.centerBottom.y-48, ig.Font.ALIGN.CENTER );
			}
			this.fontBlack.draw('Game design & code: P1X Games', this.GUI.centerBottom.x, this.GUI.centerBottom.y-24, ig.Font.ALIGN.CENTER );
			this.fontBlack.draw('(c) 2014', this.GUI.centerBottom.x, this.GUI.centerBottom.y-14, ig.Font.ALIGN.CENTER );
		}

		
		if(this.STATE == 'game'){
			this.logoImage.draw(this.GUI.middleTop.x-24, this.GUI.middleTop.y-2);
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