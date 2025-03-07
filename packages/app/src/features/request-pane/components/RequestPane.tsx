import BeakHubContext from '@beak/app/contexts/beak-hub-context';
import BeakRequestPreferences from '@beak/app/lib/beak-hub/request-preferences';
import { RequestNode } from '@beak/common/types/beak-project';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement } from 'react-reflex';
import styled from 'styled-components';

import ReflexSplitter from '../../../components/atoms/ReflexSplitter';
import RequestPreferencesContext from '../contexts/request-preferences-context';
import RequestOutput from './molecules/RequestOutput';
import Header from './organisms/Header';
import Modifiers from './organisms/Modifiers';

const RequestPane: React.FunctionComponent = () => {
	const [preferences, setPreferences] = useState<BeakRequestPreferences>();
	const { tree, selectedTabPayload } = useSelector(s => s.global.project);
	const selectedNode = tree[selectedTabPayload!];
	const hub = useContext(BeakHubContext);

	useEffect(() => {
		if (!selectedTabPayload || !selectedNode)
			return;

		const reqPref = new BeakRequestPreferences(hub!, selectedNode.id);

		reqPref.load().then(() => setPreferences(reqPref));
	}, [selectedTabPayload, selectedNode]);

	// TODO(afr): Maybe some sort of purgatory state here
	if (!selectedTabPayload)
		return <Container />;

	if (!preferences)
		return <Container />;

	// TODO(afr): Handle this state
	if (selectedTabPayload && !selectedNode)
		return <span>{'id does not exist'}</span>;

	const typedSelectedNode = selectedNode as RequestNode;

	return (
		<RequestPreferencesContext.Provider value={preferences}>
			<Container>
				<Header node={typedSelectedNode} />
				<ReflexContainer orientation={'horizontal'}>
					<ReflexElement
						flex={8}
						minSize={400}
					>
						<Modifiers node={typedSelectedNode} />
					</ReflexElement>

					<ReflexSplitter orientation={'horizontal'} />

					<ReflexElement
						flex={2}
						minSize={150}
						style={{ overflowY: 'hidden' }}
					>
						<RequestOutput selectedNode={typedSelectedNode} />
					</ReflexElement>
				</ReflexContainer>
			</Container>
		</RequestPreferencesContext.Provider>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;

	height: calc(100% - 39px);
	width: 100%;

	background-color: ${props => props.theme.ui.surface};
`;

export default RequestPane;
