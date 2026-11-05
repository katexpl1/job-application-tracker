"use client";

import { useApplication, useUpdateApplicationDetails } from "@/lib/hooks";
import {
  useGenerateCoverLetter,
  useUpdateApplication,
} from "./ApplicationDetailsContent.hooks";
import {
  ApplicationStatus,
  JOB_TYPE_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/applications/applications.consts";
import {
  Button,
  DatePicker,
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
import { useRouter } from "next/navigation";
import * as Styled from "./ApplicationDetailsContent.styles";
import { mapToApplicationFormValues } from "./ApplicationDetailsContent.helpers";
import { validateApplication } from "@/lib/applications/applications.helpers";
import { EMPTY_APPLICATION_FORM } from "@/lib/applications/applications.types";
import type {
  ApplicationForm,
  IApplicationDetailsModel,
} from "@/lib/applications/applications.types";

interface IProps {
  id: string;
  initialData?: IApplicationDetailsModel;
}

export function ApplicationDetailsContent({ id, initialData }: IProps) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: application,
    isLoading: appLoading,
    isError: appError,
  } = useApplication(id, initialData);

  const { mutateAsync: updateApplication } = useUpdateApplication();
  const { mutateAsync: updateDetails } = useUpdateApplicationDetails();

  const {
    coverLetter,
    setCoverLetter,
    isGenerating: isCoverLetterGenerating,
    generate: handleCreateCoverLetter,
  } = useGenerateCoverLetter(id);

  const handleFormSubmit = async (vals: ApplicationForm) => {
    const {
      pros,
      cons,
      rejectionReason,
      contactName,
      jobPostingUrl,
      ...appFields
    } = vals;
    try {
      await Promise.all([
        updateApplication({ id, body: appFields }),
        updateDetails({
          id,
          contactName,
          jobPostingUrl,
          pros,
          cons,
          rejectionReason,
          coverLetter,
        }),
      ]);
      toast.success("Application saved!");
    } catch (err) {
      toast.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      throw err;
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
    isSubmitting,
  } = useForm<ApplicationForm>({
    validate: validateApplication,
    onError: () => toast.error("Please verify the form fields"),
    initialValues: EMPTY_APPLICATION_FORM,
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (!application) {
      return;
    }

    reset(mapToApplicationFormValues(application));
    setCoverLetter(application.coverLetter ?? "");
  }, [application, reset, setCoverLetter]);

  useEffect(() => {
    if (appError) {
      router.replace("/");
    }
  }, [appError, router]);

  if (appLoading) {
    return (
      <Styled.LoadingWrapper>
        <Spinner />
      </Styled.LoadingWrapper>
    );
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
            error={touched.companyName && errors.companyName}
          />
          <Input
            name="appliedRole"
            label="Role"
            value={values.appliedRole}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.appliedRole && errors.appliedRole}
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
          <DatePicker
            name="dateApplied"
            label="Date applied"
            value={values.dateApplied}
            onChange={(_, value) => setFieldValue("dateApplied", value)}
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
            error={touched.jobPostingUrl && errors.jobPostingUrl}
          />
          <FormField label="Status">
            <Select
              name="status"
              options={STATUS_OPTIONS}
              value={values.status}
              onChange={handleChange}
            />
          </FormField>
        </Styled.FormGrid>

        <Styled.InputsContainer>
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
          {values.status === ApplicationStatus.Rejected && (
            <Textarea
              name="rejectionReason"
              label="Rejection reason"
              value={values.rejectionReason}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}

          <Styled.FullWidth>
            <Textarea
              name="coverLetter"
              label="Cover letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </Styled.FullWidth>
          <Styled.GenerateButtonWrapper>
            <Button
              type="button"
              onClick={handleCreateCoverLetter}
              variant="secondary"
              size="sm"
              isLoading={isCoverLetterGenerating}
            >
              Generate AI Cover letter
            </Button>
          </Styled.GenerateButtonWrapper>
        </Styled.InputsContainer>

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save
        </Button>
      </Form>
    </Styled.Container>
  );
}
