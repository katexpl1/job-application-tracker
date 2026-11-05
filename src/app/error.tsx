"use client";

import { Button } from "blunt-ui";
import * as Styled from "./error.styles";

interface IProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: IProps) {
  return (
    <Styled.Wrapper>
      <h2>Something went wrong</h2>
      <Styled.Message>{error.message}</Styled.Message>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </Styled.Wrapper>
  );
}
