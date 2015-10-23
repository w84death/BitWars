ig.module(
	'game.entities.flag'
)
.requires(
    'impact.entity'
)
.defines(function(){

	EntityFlag = ig.Entity.extend({

        // PHYCICS
        type: ig.Entity.TYPE.NONE,
    	checkAgainst: ig.Entity.TYPE.NONE,

		       
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			//ig.game.shake.set(0.3);
		},

    });
});