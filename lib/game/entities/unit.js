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
		       
		animSheet: 	new ig.AnimationSheet( 'media/units/units.png', 16, 16 ),
		size: {x: 16, y:16},
		speed:100,
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

        update: function(){
			this.parent();			
			if(ig.game.fun){
				if( ((this.pos.y/16)<<0) % 2 ){
				    this.currentAnim.angle -= Math.PI/9 * ig.system.tick;
				}else{
				    this.currentAnim.angle += Math.PI/9 * ig.system.tick;
				}
			}
		},

    });

	ig.EntityPool.enableFor( EntityUnit );

});