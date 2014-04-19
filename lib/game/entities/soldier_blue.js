ig.module(
	'game.entities.soldier_blue'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntitySoldier_blue = EntityUnit.extend({

		team: 		1,
		target: 	false,
		soldier: 	true,		
		speed: 		35,
		terrain: 		2,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [0,1,2] );
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