import { App } from "app";

function main() {
    const app = new App(document.body);
    for (let i = 0; i < 7; i++) {
        const angle = i * 2 * Math.PI / 7;
        app.addNewPoint(
            Math.cos(angle) * 100,
            Math.sin(angle) * 100
        );
    }
}

main();