import { TypedObject } from '@beak/common/helpers/typescript';
import Squawk from '@beak/common/utils/squawk';
import { differenceInDays } from 'date-fns';

import { closeWindow, createOnboardingWindow, windowStack } from '../window-management';
import nestClient from './nest-client';
import persistentStore from './persistent-store';

class Arbiter {
	start() {
		setInterval(() => this.check().catch(console.error), 1800000); // 30 minutes
	}

	getStatus() {
		return persistentStore.get('arbiter');
	}

	async check() {
		const auth = nestClient.getAuth();
		let status = this.getStatus();

		if (!auth)
			return;

		try {
			await nestClient.ensureAlphaUser();

			status = {
				lastSuccessfulCheck: new Date().toISOString(),
				lastCheckError: null,
				lastCheck: new Date().toISOString(),
				status: true,
			};
		} catch (error) {
			const squawk = Squawk.coerce(error);

			status = {
				lastSuccessfulCheck: status.lastSuccessfulCheck,
				lastCheckError: squawk,
				lastCheck: new Date().toISOString(),
				status: true,
			};

			if (squawk.code !== 'unknown') {
				nestClient.setAuth(null);

				status.status = false;
			}

			console.error(error);
		}

		persistentStore.set('arbiter', status);

		// If the status is false, or it's been 5 days we need to reset
		if (status.status === false || checkExpired(status.lastSuccessfulCheck)) {
			const onboardingWindowId = createOnboardingWindow();

			TypedObject.keys(windowStack).forEach(windowId => {
				if (windowId !== onboardingWindowId)
					closeWindow(windowId);
			});

			windowStack[onboardingWindowId].focus();
		} else {
			TypedObject.values(windowStack).forEach(window => {
				if (!window)
					return;

				window.webContents.send('arbiter_broadcast', { code: 'status_update', payload: status });
			});
		}
	}
}

function checkExpired(lastSuccessfulCheck: string) {
	const now = new Date();
	const lastCheck = new Date(lastSuccessfulCheck);
	const diff = differenceInDays(now, lastCheck);

	return diff >= 5;
}

const arbiter = new Arbiter();

export default arbiter;
