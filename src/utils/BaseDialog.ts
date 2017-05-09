export abstract class BaseDialog {

    constructor (
        protected dialogId: string,
    ) {
        // do nothing
    }

    public getDialogId(): string {
        return this.dialogId;
    }
}
