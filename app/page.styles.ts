import styled from "styled-components";

export const Header = styled.header`
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors?.neutral?.[100] ?? "#f5f0e8"};
  border-bottom: 2px solid ${({ theme }) => theme.colors?.neutral?.[900] ?? "#111111"};
`;

export const AppTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const TableWrapper = styled.div`
  height: calc(100vh - 56px);
  padding: 32px;
`;
