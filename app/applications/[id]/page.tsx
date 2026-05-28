"use client";

import { ApplicationDetailsContent } from "@/app/components/ApplicationDetailsContent";
import { use } from "react";
import * as Styled from "./page.styles";

export default function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Styled.PageWrapper>
      <Styled.BackLink href="/">← Back</Styled.BackLink>
      <ApplicationDetailsContent id={id} />
    </Styled.PageWrapper>
  );
}
