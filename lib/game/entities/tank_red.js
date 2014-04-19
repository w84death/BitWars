ig.module(
	'game.entities.tank_red'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityTank_red = EntityUnit.extend({

		team: 		2,
		target: 	false,
		tank: 		true,
		speed: 		20,
		terrain: 		1,

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