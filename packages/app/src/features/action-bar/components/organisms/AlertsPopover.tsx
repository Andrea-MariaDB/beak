import { TypedObject } from '@beak/common/helpers/typescript';
import React from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import AlertSwitch from './AlertSwitch';

interface AlertsPopoverProps {
	parent: HTMLButtonElement;
	onClose: () => void;
}

const AlertsPopover: React.FunctionComponent<AlertsPopoverProps> = props => {
	const { parent, onClose } = props;
	const alerts = useSelector(s => s.global.project.alerts);
	const hasAlerts = TypedObject.keys(alerts).length > 0;
	const boundingRect = parent.getBoundingClientRect();

	return createPortal(
		<Container onClick={() => onClose()}>
			<Wrapper
				$top={boundingRect.top + parent.clientHeight + 5}
				$left={boundingRect.left - 300 + 30}
				onClick={event => void event.stopPropagation()}
			>
				{!hasAlerts && <NoAlerts>{'You have no alerts 🎉'}</NoAlerts>}
				{hasAlerts && TypedObject.values(alerts).map(alert => (<AlertSwitch alert={alert!} />))}
			</Wrapper>
		</Container>,
		document.getElementById('action-alerts-popover')!,
	);
};

const Container = styled.div`
	position: fixed;
	top: 0; bottom: 0; left: 0; right: 0;
`;

const Wrapper = styled.div<{ $top: number; $left: number }>`
	position: fixed;
	margin-top: ${p => p.$top}px;
	margin-left: ${p => p.$left}px;

	width: 300px;
	border: 1px solid ${p => p.theme.ui.backgroundBorderSeparator};
	border-radius: 5px;
	background: ${p => p.theme.ui.surface};

	z-index: 101;
`;

const NoAlerts = styled.span`
	padding: 8px 12px;
	font-size: 14px;
`;

export default AlertsPopover;
