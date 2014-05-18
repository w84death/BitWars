ig.module(
	'game.entities.particle'
)
.requires(
    'impact.entity',
    'impact.entity-pool'
)
.defines(function(){

	EntityParticle = ig.Entity.extend({
					
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.LITE,

		// SETTINGS
		lifetime: 1,
		speed: 50,

		// particles will bounce off other entities when it collides
		minBounceVelocity: 0,
		bounciness: 1.0,
		friction: { x:0, y:0 },
		timer: new ig.Timer(),

		init: function( x, y, settings ){
		    this.parent( x, y, settings );
		 
		    // init timer for fadetime
		    this.timer = new ig.Timer();
		    this.vel.y = this.speed;
		},

		reset: function( x, y, settings ) {
        	this.parent( x, y, settings );
        	this.timer.set(0);
        	this.vel.y = this.speed;
        	this.currentAnim = this.anims['idle'];
        },

		update: function(){
		    if(this.timer.delta() > this.lifetime){
		         this.kill();
		         return;
		    }		 
		    this.parent();
		} 
    });

	ig.EntityPool.enableFor( EntityParticle );

});