import Link from "next/link";
import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BackLink = styled(Link)`
  font-size: 0.875rem;
`;
