ig.module(
	'game.entities.helicopter_blue'
)
.requires(
    'game.entities.unit'
)
.defines(function(){

	EntityHelicopter_blue = EntityUnit.extend({

		team: 		1,
		target: 	false,
		helicopter: true,		
		speed: 		60,
		terrain: 	3,
		power: 		3,

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