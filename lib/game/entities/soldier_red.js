ig.module(
	'game.entities.soldier_red'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntitySoldier_red = EntityUnit.extend({
		
		team: 		2,
		target: 	false,
		soldier:	true,		
		speed: 		35,
		terrain: 	2,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.3, [3,4,5] );
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