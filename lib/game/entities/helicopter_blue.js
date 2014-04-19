ig.module(
	'game.entities.helicopter_blue'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityHelicopter_blue = EntityUnit.extend({

		blue: 		true,
		target: 	false,
		helicopter: true,
		animSheet: 	new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},
		speed: 60,

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