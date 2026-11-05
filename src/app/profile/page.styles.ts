import Link from "next/link";
import styled from "styled-components";

export const BackLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
