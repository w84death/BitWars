ig.module(
	'game.entities.flag_red'
)
.requires(
    'game.entities.flag'
)
.defines(function(){

	EntityFlag_red = EntityFlag.extend({

		blue: true,
		flag: true,
		animSheet: new ig.AnimationSheet( 'media/map/flags.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.1, [0,1,2,3] );
			this.currentAnim.gotoRandomFrame();
		},

		update: function(){
			this.parent();
		},

    });
});