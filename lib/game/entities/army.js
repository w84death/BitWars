ig.module(
	'game.entities.army'
)
.requires(
    'impact.entity',
    'impact.entity-pool'
)
.defines(function(){

	EntityArmy = ig.Entity.extend({

        // PHYCICS
        type: ig.Entity.TYPE.A,
    	checkAgainst: ig.Entity.TYPE.NONE,

		       
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
		},

		reset: function( x, y, settings ) {
        	this.parent( x, y, settings );
        },

    });

	ig.EntityPool.enableFor( EntityArmy );

});