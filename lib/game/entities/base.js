ig.module(
	'game.entities.base'
)
.requires(
    'game.entities.terrain'
)
.defines(function(){

	EntityBase = EntityTerrain.extend({

		animSheet: new ig.AnimationSheet( 'media/map/summer.png', 16, 16 ),
		size: {x: 16, y:16},
		base: true,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 1, [6] );
			this.addAnim( 'blue', 1, [7] );
			this.addAnim( 'red', 1, [8] );
			this.name = settings.name;
			this.team = 0;
		},

		capture: function(team){
			if(team === 1){
				this.currentAnim = this.anims.blue;
			}else{
				this.currentAnim = this.anims.red;
			}
			this.team = team;
		},

		update: function(){
			this.parent();
		},

    });
});