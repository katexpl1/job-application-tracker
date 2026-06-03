"use client";

import {
  Button,
  Form,
  FormField,
  Input,
  Modal,
  Select,
  Textarea,
  useForm,
  useToast,
} from "blunt-ui";
import { useCallback, useState } from "react";
import { useCreateApplication, useUpdateApplicationDetails } from "./lib/hooks";
import {
  JOB_TYPE_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
} from "./applications/[id]/ApplicationDetailsContent/ApplicationDetailsContent.consts";
import { validateApplication } from "./applications/[id]/ApplicationDetailsContent/ApplicationDetailsContent.helpers";
import type { ApplicationForm } from "./applications/[id]/ApplicationDetailsContent/ApplicationDetailsContent.types";
import { EMPTY_APPLICATION_FORM } from "./applications/[id]/ApplicationDetailsContent/ApplicationDetailsContent.types";
import styled from "styled-components";

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
`;

const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

const INITIAL: ApplicationForm = {
  ...EMPTY_APPLICATION_FORM,
  status: "Applied",
};

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function AddApplicationModal({ open, onClose }: IProps) {
  const { toast } = useToast();
  const { mutateAsync: createApplication } = useCreateApplication();
  const { mutateAsync: updateDetails } = useUpdateApplicationDetails();
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, reset } =
    useForm<ApplicationForm>({
      initialValues: INITIAL,
      validate: validateApplication,
      onError: () => toast.error("Please verify the form fields"),
      onSubmit: async (vals) => {
        const {
          pros, cons, rejectionReason, contactName, jobPostingUrl,
          ...appFields
        } = vals;

        const created = await createApplication({
          companyName: appFields.companyName,
          appliedRole: appFields.appliedRole,
          location: appFields.location || undefined,
          jobType: appFields.jobType || undefined,
          dateApplied: appFields.dateApplied || undefined,
          source: appFields.source || undefined,
          salaryRange: appFields.salaryRange || undefined,
          status: appFields.status || undefined,
        });

        await updateDetails({
          id: created.id,
          contactName: contactName || undefined,
          jobPostingUrl: jobPostingUrl || undefined,
          pros: pros || undefined,
          cons: cons || undefined,
          rejectionReason: rejectionReason || undefined,
          coverLetter: coverLetter || undefined,
        });

        toast.success("New application added!");
        handleClose();
      },
    });

  const handleClose = useCallback(() => {
    reset(INITIAL);
    setCoverLetter("");
    onClose();
  }, [onClose, reset]);

  const handleGenerateCoverLetter = useCallback(async () => {
    setIsGenerating(true);
    setCoverLetter("");
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok || !res.body) {
        toast.error("Failed to generate cover letter");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}
        setCoverLetter((prev) => prev + decoder.decode(value));
      }
    } catch {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  }, [values, toast]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add application"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Save
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit}>
        <FormGrid>
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
              placeholder="Select job type"
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
              placeholder="Select source"
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
        </FormGrid>

        <InputsContainer>
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
          <Textarea
            name="coverLetter"
            label="Cover letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleGenerateCoverLetter}
            variant="secondary"
            size="sm"
            isLoading={isGenerating}
            style={{ marginTop: -16 }}
          >
            Generate AI Cover letter
          </Button>
        </InputsContainer>
      </Form>
    </Modal>
  );
}
