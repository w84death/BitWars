ig.module(
	'game.entities.tank_blue'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityTank_blue = EntityUnit.extend({

		blue: 		true,
		target: 	false,
		tank: 		true,
		animSheet: 	new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},
		speed: 20,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [6,7,8] );
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