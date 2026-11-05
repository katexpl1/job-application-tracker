"use client";

import { Spinner } from "blunt-ui";
import * as Styled from "./page.styles";

export default function Loading() {
  return (
    <>
      <Styled.Header>
        <Styled.ButtonWithTitleWrapper>
          <Styled.AppTitle>Job Tracker</Styled.AppTitle>
        </Styled.ButtonWithTitleWrapper>
      </Styled.Header>
      <Styled.CenteredTableWrapper>
        <Spinner size="lg" label="Loading applications..." />
      </Styled.CenteredTableWrapper>
    </>
  );
}
