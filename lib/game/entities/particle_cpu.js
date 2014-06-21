
ig.module(
    'game.entities.particle_cpu'
)
.requires(
    'game.entities.particle'
)
.defines(function(){

    EntityParticle_cpu = EntityParticle.extend({

        animSheet: new ig.AnimationSheet( 'media/units/cpu.png', 16, 16 ),
        size: { x:16, y:16 },
        offset: { x:0, y:0 },
        lifetime:2,
        wobble:20,

        //sSplash:  new ig.Sound( 'media/sounds/splash.*' ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'blue', 0.4, [7,8] );
            this.addAnim( 'red', 0.4, [9,10] );
            this.currentAnim = this.anims[settings.team-1 ? 'red' : 'blue'];
            this.currentAnim.gotoRandomFrame();
            this.vel.y = -70+((Math.random()*30)<<0);
        },

        reset: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.timer.set(0);
            this.currentAnim = this.anims[settings.team-1 ? 'red' : 'blue'];
            this.currentAnim.gotoRandomFrame();
            this.vel.x = 0;
            this.vel.y = -70+((Math.random()*30)<<0);
        },

        update: function(){
            this.parent();
            this.vel.x = (Math.sin(this.timer.delta()*10)*this.wobble)<<0;
        },

    });

});