import { Button } from "blunt-ui";
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
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[900]};
`;

export const AppTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const TableWrapper = styled.div`
  height: calc(100vh - 56px);
  overflow: auto;
  padding: 32px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;
`;

export const LogoutButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral[0]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[600]};
  }
`;

export const ButtonWithTitleWrapper = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;
