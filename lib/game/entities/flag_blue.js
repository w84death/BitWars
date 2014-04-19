ig.module(
	'game.entities.flag_blue'
)
.requires(
    'game.entities.flag'
)
.defines(function(){

	EntityFlag_blue = EntityFlag.extend({

		animSheet: new ig.AnimationSheet( 'media/map/flags.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.1, [4,5,6,7] );
			this.currentAnim.gotoRandomFrame();
		},

		update: function(){
			this.parent();
		},

    });
});