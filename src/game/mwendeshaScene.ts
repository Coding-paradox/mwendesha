import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    DirectionalLight,
    Color4,
    Color3,
} from "@babylonjs/core";

export class MwendeshaScene {
    public engine: Engine;
    public scene: Scene;
    public camera: ArcRotateCamera;

    constructor(canvasElement: HTMLCanvasElement) {
        this.engine = new Engine(canvasElement, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            adaptToDeviceRatio: true,
        });

        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0.78, 0.68, 0.5, 1);
        this.scene.fogMode = Scene.FOGMODE_EXP2;
        this.scene.fogColor = new Color3(0.78, 0.68, 0.5);
        this.scene.fogDensity = 0.0022;

        this.camera = new ArcRotateCamera(
            "mwendeshaCamera",
            -Math.PI / 2,
            1.32,
            15,
            new Vector3(0, 1.1, 0),
            this.scene
        );
        this.camera.attachControl(canvasElement, true);
        this.camera.lowerRadiusLimit = 9;
        this.camera.upperRadiusLimit = 24;
        this.camera.wheelDeltaPercentage = 0.02;

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.7;

        const dirLight = new DirectionalLight("sunLight", new Vector3(-1, -2, -1), this.scene);
        dirLight.position = new Vector3(30, 50, 30);
        dirLight.intensity = 0.9;

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    public dispose(): void {
        this.scene.dispose();
        this.engine.dispose();
    }
}
