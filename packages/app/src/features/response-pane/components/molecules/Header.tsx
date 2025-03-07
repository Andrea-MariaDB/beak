import { Flight } from '@beak/app/store/flight/types';
import { convertRequestToUrl } from '@beak/app/utils/uri';
import { statusToColour } from '@beak/design-system/helpers';
import { getReasonPhrase } from 'http-status-codes';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

export interface HeaderProps {
	selectedFlight: Flight;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
	const { selectedGroups, variableGroups } = useSelector(s => s.global.variableGroups);
	const projectPath = useSelector(s => s.global.project.projectPath)!;
	const { error, request, response } = props.selectedFlight;
	const context = { projectPath, selectedGroups, variableGroups };
	const [url, setUrl] = useState('');

	useEffect(() => {
		convertRequestToUrl(context, request).then(s => setUrl(s.toString()));
	}, [context, request]);

	return (
		<UrlHeaderWrapper>
			<Section>
				<strong>{request.verb.toUpperCase()}</strong>
			</Section>
			<UrlSection>
				<Abbr title={url}>
					{/* The "&lrm;" char is a requirement of using RTL to trim the end vs start of the string */}
					{url}&lrm;
				</Abbr>
			</UrlSection>
			{response && (
				<StatusSection $status={response.status}>
					<strong>{response.status}</strong>
					{' '}
					{safeGetReasonPhrase(response.status)}
				</StatusSection>
			)}
			{error && (
				<StatusSection $status={500}>
					<strong>{'Error'}</strong>
				</StatusSection>
			)}
		</UrlHeaderWrapper>
	);
};

function safeGetReasonPhrase(status: number) {
	try {
		return getReasonPhrase(status);
	} catch {
		return '';
	}
}

const UrlHeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	margin: 25px auto;
	padding: 0 10px;
	font-size: 13px;
	max-width: calc(100% - 20px);
`;

const Section = styled.div`
	flex: 0 0 auto;
	background-color: ${p => p.theme.ui.background};

	border: 1px solid ${p => p.theme.ui.primaryFill};
	border-radius: 4px;

	padding: 5px 8px;
	margin: 0 5px;
`;

const UrlSection = styled(Section)`
	flex: 1 1 auto;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	direction: rtl;
`;

const Abbr = styled.abbr`
	text-decoration: none;
`;

const StatusSection = styled(Section)<{ $status: number }>`
	background-color: ${p => p.theme.ui.background};
	border-color: ${p => statusToColour(p.$status)};
	color: ${p => statusToColour(p.$status)};

	white-space: nowrap;
`;

export default Header;
