ig.module(
	'game.entities.grass'
)
.requires(
    'game.entities.terrain'
)
.defines(function(){

	EntityGrass = EntityTerrain.extend({

		animSheet: new ig.AnimationSheet( 'media/map/summer.png', 16, 16 ),
		size: {x: 16, y:16},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 1, [0] );
		},

		update: function(){
			this.parent();
		},

    });
});