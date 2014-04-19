ig.module(
	'game.entities.helicopter_red'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityHelicopter_red = EntityUnit.extend({

		team: 		2,
		target: 	false,
		helicopter: true,
		animSheet: 	new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},
		speed: 60,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [16,17,16,18,19,18] );
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