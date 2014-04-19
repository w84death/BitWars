ig.module(
	'game.entities.tank_blue'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityTank_blue = EntityUnit.extend({

		team: 		1,
		target: 	false,
		tank: 		true,		
		speed: 		20,
		terrain: 		1,

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