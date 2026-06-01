"use client";

import { useProfile, useUpdateProfile } from "@/app/lib/hooks";
import {
  Button,
  Form,
  Input,
  Spinner,
  Textarea,
  useForm,
  useToast,
} from "blunt-ui";
import { useEffect } from "react";
import { mapProfileToFormValues } from "./ProfileContent.helpers";
import * as Styled from "./ProfileContent.styles";
import { EMPTY_PROFILE_FORM, ProfileForm } from "./ProfileContent.types";

export function ProfileContent() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const handleFormSubmit = async (vals: ProfileForm) => {
    try {
      await updateProfile(vals);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      throw err;
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isSubmitting,
  } = useForm<ProfileForm>({
    initialValues: EMPTY_PROFILE_FORM,
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }
    reset(mapProfileToFormValues(profile));
  }, [profile]);

  if (isLoading) {
    return (
      <Styled.LoadingWrapper>
        <Spinner />
      </Styled.LoadingWrapper>
    );
  }

  return (
    <Styled.PageWrapper>
      <Form onSubmit={handleSubmit}>
        <Styled.FormGrid>
          <Input
            name="firstName"
            label="First name"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="lastName"
            label="Last name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="title"
            label="Title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="yearsOfExperience"
            label="Years of experience"
            value={values.yearsOfExperience}
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
          <Input
            name="linkedIn"
            label="LinkedIn"
            value={values.linkedIn}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="github"
            label="GitHub"
            value={values.github}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            name="portfolioUrl"
            label="Portfolio URL"
            value={values.portfolioUrl}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Styled.FormGrid>

        <Styled.InputsContainer>
          <Textarea
            name="bio"
            label="Bio"
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Textarea
            name="skills"
            label="Skills"
            value={values.skills}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Styled.InputsContainer>

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save
        </Button>
      </Form>
    </Styled.PageWrapper>
  );
}
