import styled from 'styled-components';

const ActionBarButton = styled.button`
	border: none;
	border-radius: 4px;
	padding: 0px 8px;
	height: 25px;
	background: transparent;

	&:hover:not(:disabled) {
		background: ${p => p.theme.ui.surface};
	}
	&:disabled {
		opacity: 0.5;
	}
	&:focus {
		outline: 0;
	}

	&:not(:disabled) {
		cursor: pointer;
	}
`;

export default ActionBarButton;
