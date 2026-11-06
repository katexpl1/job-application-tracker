import { Button } from "blunt-ui";
import styled from "styled-components";
import { media } from "@/lib/media";

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
  padding: 32px;

  ${media.mobile} {
    padding: 8px;
  }
`;

export const TableHeightContainer = styled.div`
  max-height: calc(100vh - 56px - 64px);

  ${media.mobile} {
    max-height: calc(100vh - 56px - 16px);
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;

  ${media.mobile} {
    display: none;
  }
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

  ${media.mobile} {
    gap: 12px;
  }
`;

export const HamburgerButton = styled.button<{ $open: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  ${media.mobile} {
    display: flex;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.neutral[900]};
    border-radius: 2px;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  span:nth-child(1) {
    transform: ${({ $open }) => $open ? "translateY(7px) rotate(45deg)" : "none"};
  }

  span:nth-child(2) {
    opacity: ${({ $open }) => $open ? 0 : 1};
  }

  span:nth-child(3) {
    transform: ${({ $open }) => $open ? "translateY(-7px) rotate(-45deg)" : "none"};
  }
`;

export const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;

  ${media.mobile} {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[900]};
    padding: ${({ theme }) => theme.spacing[2]};
    gap: ${({ theme }) => theme.spacing[2]};
    z-index: 9;

    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: ${({ $open }) => ($open ? "translateY(0)" : "translateY(-8px)")};
    pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
    visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  }
`;
