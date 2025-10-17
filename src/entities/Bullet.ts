export default class Bullet extends Phaser.GameObjects.Rectangle {
    private _arcadeBody: Phaser.Physics.Arcade.Body;

    public init() {
        this.scene.physics.add.existing(this);

        this._arcadeBody = this.body as Phaser.Physics.Arcade.Body;
        this._arcadeBody.allowGravity = false;
        this._arcadeBody.setFriction(0, 0);
    }

    public enable(x: number, y: number, width: number, height: number, color: number, velocityX: number, velocityY: number) {
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5);
        this.setFillStyle(color);

        this.scene.physics.world.add(this._arcadeBody);
        this.setActive(true);
        this.setVisible(true);

        this._arcadeBody.setVelocity(velocityX, velocityY);

        // Rotate the bullet to face the direction it's moving
        this.setRotation(this._arcadeBody.velocity.angle());

        // Maths way
        // this.setRotation(Math.atan2(velocityY, velocityX));

        // Arcade bodies can't rotate: fit the body to the rotated bullet bounds
        const cos: number = Math.abs(Math.cos(this.rotation));
        const sin: number = Math.abs(Math.sin(this.rotation));
        this._arcadeBody.setSize(width * cos + height * sin, width * sin + height * cos);
    }

    public disable() {
        this.scene.physics.world.disableBody(this._arcadeBody);
        this.setActive(false);
        this.setVisible(false);
    }

    update(timeSinceLaunch: number, deltaTime: number) {
        super.update(timeSinceLaunch, deltaTime);

        // Bullets can now fly in any direction: recycle them when they leave the screen on any side
        const camera = this.scene.cameras.main;
        if (this.x < -this.displayWidth || this.x > camera.width + this.displayWidth
            || this.y < -this.displayHeight || this.y > camera.height + this.displayHeight) {
            this.disable();
        }
    }
}