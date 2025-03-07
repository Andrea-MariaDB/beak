import { IpcAppServiceRenderer } from '@beak/common/ipc/app';
import { IpcArbiterServiceRenderer } from '@beak/common/ipc/arbiter';
import { IpcBeakHubServiceRenderer } from '@beak/common/ipc/beak-hub';
import { IpcDialogServiceRenderer } from '@beak/common/ipc/dialog';
import { IpcEncryptionServiceRenderer } from '@beak/common/ipc/encryption';
import { IpcExplorerServiceRenderer } from '@beak/common/ipc/explorer';
import { IpcFlightServiceRenderer } from '@beak/common/ipc/flight';
import { IpcNestServiceRenderer } from '@beak/common/ipc/nest';
import { IpcProjectServiceRenderer } from '@beak/common/ipc/project';
import { IpcWindowServiceRenderer } from '@beak/common/ipc/window';

const { ipcRenderer } = window.require('electron');

const ipcAppService = new IpcAppServiceRenderer(ipcRenderer);
const ipcArbiterService = new IpcArbiterServiceRenderer(ipcRenderer);
const ipcBeakHubService = new IpcBeakHubServiceRenderer(ipcRenderer);
const ipcDialogService = new IpcDialogServiceRenderer(ipcRenderer);
const ipcEncryptionService = new IpcEncryptionServiceRenderer(ipcRenderer);
const ipcExplorerService = new IpcExplorerServiceRenderer(ipcRenderer);
const ipcFlightService = new IpcFlightServiceRenderer(ipcRenderer);
const ipcNestService = new IpcNestServiceRenderer(ipcRenderer);
const ipcProjectService = new IpcProjectServiceRenderer(ipcRenderer);
const ipcWindowService = new IpcWindowServiceRenderer(ipcRenderer);

export {
	ipcAppService,
	ipcArbiterService,
	ipcBeakHubService,
	ipcDialogService,
	ipcEncryptionService,
	ipcExplorerService,
	ipcFlightService,
	ipcNestService,
	ipcProjectService,
	ipcWindowService,
};
