import {
	IpcMain,
	IpcRenderer,
} from 'electron';

import { IpcServiceMain, IpcServiceRenderer, Listener } from './ipc';

const AppMessages = {
	GetVersion: 'get_version',
};

export class IpcAppServiceRenderer extends IpcServiceRenderer {
	constructor(ipc: IpcRenderer) {
		super('app', ipc);
	}

	async getVersion() {
		return this.invoke<string>(AppMessages.GetVersion);
	}
}

export class IpcAppServiceMain extends IpcServiceMain {
	constructor(ipc: IpcMain) {
		super('app', ipc);
	}

	registerGetVersion(fn: Listener<void, string>) {
		this.registerListener(AppMessages.GetVersion, fn);
	}
}
