import { Network } from '#/App/Domain/Type/Network';

export interface AppWindow
    extends Window
{
    appData : {
        dev : boolean,
        appVariant : Network,
    }
}
