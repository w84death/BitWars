
ig.module(
	'game.entities.particle_unit'
)
.requires(
    'game.entities.particle'
)
.defines(function(){

	EntityParticle_unit = EntityParticle.extend({

		animSheet: new ig.AnimationSheet( 'media/units/units.png', 16, 16 ),
		size: { x:16, y:16 },
		offset: { x:0, y:0 },
		lifetime:1,

		//sSplash:  new ig.Sound( 'media/sounds/splash.*' ),

		init: function( x, y, settings ) {
			var unit = false;
			unit = (settings.unit.soldier ? 'soldier' : false) || (settings.unit.tank ? 'tank' : false) || (settings.unit.helicopter ? 'helicopter' : false);

			if(!unit){

				return;
			}

			this.parent( x, y, settings );

			this.addAnim( 'soldier1', 1, [0] );
			this.addAnim( 'soldier2', 1, [3] );
			this.addAnim( 'tank1', 1, [6] );
			this.addAnim( 'tank2', 1, [9] );
			this.addAnim( 'helicopter1', 1, [12] );
			this.addAnim( 'helicopter2', 1, [16] );
			var unitAnim = unit+''+settings.team;
			this.currentAnim = this.anims[unitAnim];
			this.pos.x += settings.team === 2 ? 10 : -10;
	    	this.vel.x = settings.team === 2 ? 20+(Math.random()*10)<<0 : -20-(Math.random()*10)<<0;
	    	this.vel.y = 90+((Math.random()*40)<<0);
		},

		reset: function( x, y, settings ) {
        	var unit = (settings.unit.soldier ? 'soldier' : false) || (settings.unit.tank ? 'tank' : false) || (settings.unit.helicopter ? 'helicopter' : false);
			if(!unit){
				return;
			}
        	this.parent( x, y, settings );
        	this.timer.set(0);
        	var unitAnim = unit+''+settings.team;
			this.currentAnim = this.anims[unitAnim];
			this.pos.x += settings.team === 2 ? 10 : -10;
			this.vel.x = settings.team === 2 ? (Math.random()*10)<<0 : -(Math.random()*10)<<0;
	    	this.vel.y = 90+((Math.random()*40)<<0);
        },

        update: function(){
			this.parent();
        },

    });

});