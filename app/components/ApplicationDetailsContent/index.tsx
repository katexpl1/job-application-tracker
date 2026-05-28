"use client";

import {
  useApplication,
  useApplicationDetails,
  useUpdateApplication,
  useUpdateApplicationDetails,
} from "@/app/lib/hooks";
import { JOB_TYPE_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS } from "@/app/consts";
import {
  Button,
  Form,
  FormField,
  Input,
  Select,
  Spinner,
  Textarea,
  useForm,
  useToast,
} from "blunt-ui";
import { useEffect } from "react";
import * as Styled from "./ApplicationDetailsContent.styles";

interface Props {
  id: string;
}

type CombinedForm = {
  companyName: string;
  appliedRole: string;
  location: string;
  jobType: string;
  dateApplied: string;
  source: string;
  salaryRange: string;
  contactName: string;
  jobPostingUrl: string;
  status: string;
  comment: string;
  notes: string;
  pros: string;
  cons: string;
  rejectionReason: string;
};

export function ApplicationDetailsContent({ id }: Props) {
  const { toast } = useToast();
  const {
    data: application,
    isLoading: appLoading,
    isError: appError,
  } = useApplication(id);
  const { data: details } = useApplicationDetails(id);
  const { mutate: updateApplication } = useUpdateApplication();
  const { mutate: updateDetails } = useUpdateApplicationDetails();

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting } =
    useForm<CombinedForm>({
      initialValues: {
        companyName: "",
        appliedRole: "",
        location: "",
        jobType: "",
        dateApplied: "",
        source: "",
        salaryRange: "",
        contactName: "",
        jobPostingUrl: "",
        status: "",
        comment: "",
        notes: "",
        pros: "",
        cons: "",
        rejectionReason: "",
      },
      onSubmit: async (vals) => {
        const { notes, pros, cons, rejectionReason, ...appFields } = vals;
        try {
          await Promise.all([
            new Promise<void>((resolve, reject) =>
              updateApplication({ id, body: appFields }, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
              }),
            ),
            new Promise<void>((resolve, reject) =>
              updateDetails({ id, notes, pros, cons, rejectionReason }, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
              }),
            ),
          ]);
          toast.success("Saved!");
        } catch (err) {
          toast.error(`Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`);
          throw err;
        }
      },
    });

  useEffect(() => {
    if (!application) return;
    setFieldValue("companyName", application.companyName ?? "");
    setFieldValue("appliedRole", application.appliedRole ?? "");
    setFieldValue("location", application.location ?? "");
    setFieldValue("jobType", application.jobType ?? "");
    setFieldValue("dateApplied", application.dateApplied ?? "");
    setFieldValue("source", application.source ?? "");
    setFieldValue("salaryRange", application.salaryRange ?? "");
    setFieldValue("contactName", application.contactName ?? "");
    setFieldValue("jobPostingUrl", application.jobPostingUrl ?? "");
    setFieldValue("status", application.status ?? "");
    setFieldValue("comment", application.comment ?? "");
  }, [application]);

  useEffect(() => {
    if (!details) return;
    setFieldValue("notes", details.notes ?? "");
    setFieldValue("pros", details.pros ?? "");
    setFieldValue("cons", details.cons ?? "");
    setFieldValue("rejectionReason", details.rejectionReason ?? "");
  }, [details]);

  if (appLoading) {
    return (
      <Styled.LoadingWrapper>
        <Spinner />
      </Styled.LoadingWrapper>
    );
  }

  if (appError || !application) {
    return <Styled.ErrorState>Failed to load application.</Styled.ErrorState>;
  }

  return (
    <Styled.Container>
      <Form onSubmit={handleSubmit}>
        <Styled.FormGrid>
          <Input
            name="companyName"
            label="Company"
            value={values.companyName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="appliedRole"
            label="Role"
            value={values.appliedRole}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="location"
            label="Location"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormField label="Job type">
            <Select
              name="jobType"
              options={JOB_TYPE_OPTIONS}
              value={values.jobType}
              onChange={handleChange}
            />
          </FormField>
          <Input
            name="dateApplied"
            label="Date applied"
            value={values.dateApplied}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormField label="Source">
            <Select
              name="source"
              options={SOURCE_OPTIONS}
              value={values.source}
              onChange={handleChange}
            />
          </FormField>
          <Input
            name="salaryRange"
            label="Salary range"
            value={values.salaryRange}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="contactName"
            label="Contact name"
            value={values.contactName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="jobPostingUrl"
            label="Job posting URL"
            value={values.jobPostingUrl}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormField label="Status">
            <Select
              name="status"
              options={STATUS_OPTIONS}
              value={values.status}
              onChange={handleChange}
            />
          </FormField>
          <Styled.FullWidth>
            <Textarea
              name="comment"
              label="Comment"
              value={values.comment}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Styled.FullWidth>
        </Styled.FormGrid>

        <Styled.InputsContainer>
          <Textarea
            name="notes"
            label="Notes"
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Textarea
            name="pros"
            label="Pros"
            value={values.pros}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Textarea
            name="cons"
            label="Cons"
            value={values.cons}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {values.status === "Rejected" && (
            <Textarea
              name="rejectionReason"
              label="Rejection reason"
              value={values.rejectionReason}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </Styled.InputsContainer>

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save
        </Button>
      </Form>
    </Styled.Container>
  );
}
