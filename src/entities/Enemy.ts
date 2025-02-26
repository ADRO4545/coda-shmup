import Entity from './Entity.ts';
import Bullet from "./Bullet.ts";

export default class Enemy extends Entity {
    private _shootTimer: Phaser.Time.TimerEvent;

    public init(bulletsGroup: Phaser.Physics.Arcade.Group) {
        this.bullets = bulletsGroup;

        this._shootTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 3000),
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });

        // Create animation when enemy is about to shoot in the global animation manager
        if (!this.scene.anims.exists('ufoShoot')) {
            this.scene.anims.create({
                key: 'ufoShoot',
                frames: [
                    {key: 'sprites', frame: 'ufoRed'},
                    {key: 'sprites', frame: 'ufoRed-shoot0'},
                    {key: 'sprites', frame: 'ufoRed-shoot1'}
                ],
                frameRate: 4,
            });
        }

        this.arcadeBody.setVelocityY(256);
    }

    destroy(fromScene?: boolean) {
        this._shootTimer?.remove();

        super.destroy(fromScene);
    }

    private shoot() {
        this.play('ufoShoot');
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setTexture('sprites', 'ufoRed');

            const bullet: Bullet = this.bullets.get() as Bullet;
            if (bullet) {
                bullet.enable(this.x, this.y + this.displayHeight / 2, 12, 12, 0xf25f5c, 512);
            }
        });
    }

    preUpdate(timeSinceLaunch: number, deltaTime: number) {
        super.preUpdate(timeSinceLaunch, deltaTime)

        // Destroy entities when out of screen
        if (this.y > this.scene.cameras.main.height + this.displayHeight) {
            this.destroy();
        }
    }
}