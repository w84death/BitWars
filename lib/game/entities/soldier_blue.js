ig.module(
	'game.entities.soldier_red'
)
.requires(
    'game.entities.army'
)
.defines(function(){

	EntitySoldier_red = EntityArmy.extend({

		animSheet: new ig.AnimationSheet( 'media/army/army.png', 16, 16 ),
		size: {x: 16, y:16},

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