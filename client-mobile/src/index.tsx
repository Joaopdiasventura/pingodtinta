import React from 'react';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { StyledMessage } from './styles/message';

const StyledContainer = styled.View`
`;




export default function App() {
    
  return (
    <StyledContainer>
        <StyledMessage>opa</StyledMessage>
    </StyledContainer>
  );
}

