export interface AppWindow
    extends Window
{
    appData : {
        dev : boolean,
        appVariant : string,
    }
}
