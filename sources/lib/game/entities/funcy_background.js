ig.module(
		'game.entities.funcy_background'
)
.requires(
		'impact.entity'
)
.defines(function(){

	EntityFuncy_background = ig.Entity.extend({

		animSheet: new ig.AnimationSheet( 'media/gui/backgrounds.png', 16, 196),			
		size: {x:16, y:196},
		gravityFactor: 0,
		zIndex: 10,

		init: function( x, y, settings ) {
					this.parent( x, y, settings );
					this.size.x = this.settings.width;
					this.size.y = this.settings.height;
					this.addAnim( 'green', 0.1, [0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,2,1,0] );
					this.addAnim( 'red', 0.1, [5,5,5,5,5,5,5,5,5,6,7,8,9,8,8,7,6,5] );
					this.addAnim( 'blue', 0.1, [10,10,10,10,10,10,10,10,10,11,12,13,14,14,13,12,11,10] );
					this.addAnim( 'menu', 0.1, [15,15,15,15,15,15,15,15,15,16,17,18,19,19,18,17,16,15] );
					this.currentAnim = this.anims['menu'];
		},

		update: function(){
			this.parent();
			if(ig.game.STATE == 'intro' || ig.game.STATE == 'map' || ig.game.STATE == 'menu' || ig.game.STATE == 'tutorial' || ig.game.STATE == 'game_menu'){
				this.currentAnim = this.anims['menu'];
			}

			if(ig.game.STATE == 'game' || ig.game.STATE == 'move'){			
				this.currentAnim = this.anims['green'];
			}
			if(ig.game.STATE == 'game_over'){
				if(ig.game.teams[0].score > ig.game.teams[1].score){
					this.currentAnim = this.anims['blue'];
				}else
				if(ig.game.teams[0].score < ig.game.teams[1].score){
					this.currentAnim = this.anims['red'];
				}else{
					this.currentAnim = this.anims['green'];
				}
			}
		},
		
		draw: function(){
				for (var i = 0; i < ig.system.width; i++) {
					this.currentAnim.draw(i*16,0);  
				};
		},

		kill: function(){
			// I am immortal!!
		}
	 
	});

});
