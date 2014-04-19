ig.module(
	'game.entities.unit'
)
.requires(
    'impact.entity',
    'impact.entity-pool'
)
.defines(function(){

	EntityUnit = ig.Entity.extend({

        // PHYCICS
        type: ig.Entity.TYPE.NONE,
    	checkAgainst: ig.Entity.TYPE.NONE,
		       
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.name = settings.name;
			this.turn = settings.turn;
		},

		reset: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.name = settings.name;
			this.turn = settings.turn;
        },

    });

	ig.EntityPool.enableFor( EntityUnit );

});