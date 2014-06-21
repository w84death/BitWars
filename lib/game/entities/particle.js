ig.module(
	'game.entities.particle'
)
.requires(
    'impact.entity',
    'impact.entity-pool'
)
.defines(function(){

	EntityParticle = ig.Entity.extend({

		size: { x:1, y:1 },
		offset: { x:0, y:0 },

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		friction: { x:0, y:0 },

		// SETTINGS
		lifetime: 1,
		fadetime: 999,
		playOnce: false,
        alpha: 1,

		init: function( x, y, settings ){
		    this.parent( x, y, settings );
		    this.timer = new ig.Timer();
		},

		reset: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.alpha = 1;
        	this.timer.set(0);
        	if(this.playOnce && this.anims.length>0){
        		this.currentAnim = this.anims['idle'];
        		this.currentAnim.rewind();
        	}
        },

		update: function(){
		this.parent();
		    if(this.playOnce){
		    	this.alpha = 1;
		    	if(this.currentAnim.loopCount > 0){
		    		this.kill();
			        return;
		    	}
		    }else{
		    	this.alpha = this.timer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
			    if(this.timer.delta() > this.lifetime){
					this.kill();
					return;
			    }
		    }



		}
    });

	ig.EntityPool.enableFor( EntityParticle );

});