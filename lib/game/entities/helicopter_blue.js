ig.module(
	'game.entities.helicopter_blue'
)
.requires(
    'game.entities.army'
)
.defines(function(){

	EntityHelicopter_blue = EntityArmy.extend({

		animSheet: new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [12,13,12,14,15,14] );
			this.currentAnim.gotoRandomFrame();
		},

		reset: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.currentAnim.gotoRandomFrame();
        },

		update: function(){
			this.parent();
		},

    });
});