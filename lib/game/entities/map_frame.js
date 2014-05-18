ig.module(
		'game.entities.map_frame'
)
.requires(
		'impact.entity'
)
.defines(function(){

	EntityMap_frame = ig.Entity.extend({

		mapFrameSheet: 	new ig.Image( 'media/gui/frame.png' ),
		size: {x:16, y:16},
		gravityFactor: 0,
		zIndex: 20,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
		},

		update: function(){
			this.parent();			
		},
		
		renderMapFrame: function(){
			var newX, newY;
			for (var x = 0; x < ig.game.map.blueprint.width; x++) {
				for (var y = 0; y < ig.game.map.blueprint.height; y++) {
					// top frame
					if(y == 0){
						newX = (ig.game.map.pointZero.x) + x*16;
						newY = (ig.game.map.pointZero.y - 16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,1,16,16);
					}

					if(y == ig.game.map.blueprint.height-1){
						newX = (ig.game.map.pointZero.x) + x*16;
						newY = (ig.game.map.pointZero.y+16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,7,16,16);
					}

					if(x == 0){
						newX = (ig.game.map.pointZero.x - 16) + x*16;
						newY = (ig.game.map.pointZero.y) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,3,16,16);
					}

					if(x == ig.game.map.blueprint.width-1){
						newX = (ig.game.map.pointZero.x+16) + x*16;
						newY = (ig.game.map.pointZero.y) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,5,16,16);
					}

					if(x == 0 && y == 0){
						newX = (ig.game.map.pointZero.x - 16) + x*16;
						newY = (ig.game.map.pointZero.y - 16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,0,16,16);
					}

					if(x == ig.game.map.blueprint.width-1 && y == 0){
						newX = (ig.game.map.pointZero.x + 16) + x*16;
						newY = (ig.game.map.pointZero.y - 16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,2,16,16);
					}

					if(x == 0 && y == ig.game.map.blueprint.height-1){
						newX = (ig.game.map.pointZero.x - 16) + x*16;
						newY = (ig.game.map.pointZero.y + 16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,6,16,16);
					}

					if(x == ig.game.map.blueprint.width-1 && y == ig.game.map.blueprint.height-1){
						newX = (ig.game.map.pointZero.x + 16) + x*16;
						newY = (ig.game.map.pointZero.y + 16) + y*16;
						this.mapFrameSheet.drawTile(newX,newY,8,16,16);
					}
				}
			}
		},

		draw: function(){
			if(ig.game.STATE == 'game' || ig.game.STATE == 'move' || ig.game.STATE == 'game_menu' || ig.game.STATE == 'game_over'){					
				this.renderMapFrame();
			}
		},

		kill: function(){
			// I am immortal!!
		}
	 
	});

});
