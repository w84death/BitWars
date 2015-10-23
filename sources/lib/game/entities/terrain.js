ig.module(
	'game.entities.terrain'
)
.requires(
    'impact.entity'
)
.defines(function(){

	EntityTerrain = ig.Entity.extend({

        // PHYCICS
        type: ig.Entity.TYPE.B,
    	checkAgainst: ig.Entity.TYPE.NONE,
		       
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
		},

    });

});