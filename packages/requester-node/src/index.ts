import { RequestOverview } from '@beak/common/beak-project/types';
import { constructUri } from '@beak/common/beak-project/url';
import { TypedObject } from '@beak/common/helpers/typescript';
import {
	FlightCompletePayload,
	FlightFailedPayload,
	FlightHeartbeatPayload,
	FlightRequestPayload,
} from '@beak/common/requester/types';
import fetch, { RequestInit, Response } from 'node-fetch';

export interface RequesterOptions {
	payload: FlightRequestPayload;
	callbacks: {
		heartbeat: (payload: FlightHeartbeatPayload) => void;
		complete: (payload: FlightCompletePayload) => void;
		failed: (payload: FlightFailedPayload) => void;
	};
}

/*
Stages:
00%-25%: fetch response
25%-26%: parsing response
27%-100%: reading response body
*/

export async function startRequester(options: RequesterOptions) {
	const { payload, callbacks } = options;
	const { complete, failed, heartbeat } = callbacks;
	const { request } = payload;
	const start = Date.now();

	heartbeat({
		stage: 'fetch_response',
		payload: { timestamp: start },
	});

	let response: Response;

	try {
		response = await runRequest(request);
	} catch (error) {
		failed({ error });

		return;
	}

	const contentLengthUnstable = response.headers.get('content-length') ?? '0';
	const contentLength = Number.parseInt(contentLengthUnstable, 10) || 0;
	const hasBody = contentLength > 0;

	heartbeat({
		stage: 'parsing_response',
		payload: { contentLength, timestamp: Date.now() },
	});

	if (hasBody) {
		if (response.bodyUsed) {
			failed({ error: new Error('body already used') });

			return;
		}

		for await (const chunk of response.body) {
			heartbeat({
				stage: 'reading_body',
				payload: { buffer: chunk as Buffer, timestamp: Date.now() },
			});
		}
	}

	complete({
		timestamp: Date.now(),
		overview: {
			headers: headersToObject(response.headers),
			redirected: response.redirected,
			status: response.status,
			url: response.url,
			hasBody,
		},
	});
}

async function runRequest(overview: RequestOverview) {
	const { headers, verb } = overview;
	const url = constructUri(overview);

	const init: RequestInit = {
		method: verb,
		headers: TypedObject.values(headers)
			.filter(h => h.enabled)
			.reduce((acc, val) => ({
				...acc,
				[val.name]: val.value,
			}), {}),
		redirect: 'follow',
		compress: false,
	};

	return await fetch(url, init);
}

function headersToObject(entries: Iterable<[string, string]>) {
	const headers: Record<string, string> = {};

	for (const [key, value] of entries)
		headers[key] = value;

	return headers;
}
