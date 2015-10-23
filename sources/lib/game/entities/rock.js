ig.module(
	'game.entities.rock'
)
.requires(
    'game.entities.terrain'
)
.defines(function(){

	EntityRock = EntityTerrain.extend({

		animSheet: new ig.AnimationSheet( 'media/map/summer.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 1, [2] );
		},

		update: function(){
			this.parent();
		},

    });
});