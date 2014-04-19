ig.module(
	'game.entities.flag'
)
.requires(
    'impact.entity'
)
.defines(function(){

	EntityFlag = ig.Entity.extend({

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
});