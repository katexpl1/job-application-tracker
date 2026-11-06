import styled from "styled-components";
import { media } from "@/lib/media";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[4]} 0;
`;

export const FormWrapper = styled.div`
  width: min(50%, 480px);
  padding: 0 ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  ${media.mobile} {
    width: 100%;
  }
`;
