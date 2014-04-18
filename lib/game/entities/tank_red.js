ig.module(
	'game.entities.tank_red'
)
.requires(
    'game.entities.army'
)
.defines(function(){

	EntityTank_red = EntityArmy.extend({

		animSheet: new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [9,10,11] );
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