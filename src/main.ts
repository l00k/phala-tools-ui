import { App } from '#/App/App';
import { ObjectManager } from '@inti5/object-manager';


(async() => {
    const objectManager = ObjectManager.getSingleton();
    const app = objectManager.getService('app', App);
    await app.run();
})();
