import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const ErrorState = styled.p`
  color: #c0392b;
  font-size: 0.875rem;
`;
