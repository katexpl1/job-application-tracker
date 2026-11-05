import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  height: 100%;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
`;
