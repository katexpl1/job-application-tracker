import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { mockApplication } from "@/app/mocks/handlers";
import { server } from "@/app/mocks/server";
import { renderWithProviders } from "@/app/mocks/test-utils";
import { ApplicationDetailsContent } from ".";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}));

vi.mock("blunt-ui", () => ({
  Button: ({
    children,
    onClick,
    isLoading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
  }) => (
    <button onClick={onClick} disabled={isLoading}>
      {children}
    </button>
  ),
  Input: ({
    label,
    name,
    value,
    onChange,
    onBlur,
  }: {
    label: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  }) => (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
      />
    </>
  ),
  Textarea: ({
    label,
    name,
    value,
    onChange,
    onBlur,
  }: {
    label: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  }) => (
    <>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
      />
    </>
  ),
  Select: ({
    name,
    options,
    value,
    onChange,
  }: {
    name?: string;
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <select name={name} value={value ?? ""} onChange={onChange}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
  FormField: ({
    label,
    children,
  }: {
    label?: string;
    children: React.ReactNode;
  }) => (
    <>
      {label && <span>{label}</span>}
      {children}
    </>
  ),
  Form: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
  }) => <form onSubmit={onSubmit}>{children}</form>,
  Spinner: () => <div>Loading...</div>,
  useForm: ({ initialValues }: { initialValues: Record<string, string> }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useState } = require("react");
    const [values, setValues] = useState(initialValues);
    return {
      values,
      errors: {},
      touched: {},
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      handleSubmit: vi.fn(),
      setFieldValue: (field: string, value: string) =>
        setValues((prev: Record<string, string>) => ({
          ...prev,
          [field]: value,
        })),
      reset: (newValues?: Record<string, string>) =>
        setValues(newValues ?? initialValues),
      isSubmitting: false,
    };
  },
  useToast: () => ({ toast: { success: vi.fn(), error: vi.fn() } }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  ConfirmProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ApplicationDetailsContent", () => {
  it("shows loading state initially", () => {
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows application form fields after loading", async () => {
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("Company")).toBeInTheDocument();
      expect(screen.getByLabelText("Role")).toBeInTheDocument();
    });
  });

  it("redirects to home when application fails to load", async () => {
    server.use(
      http.get("/api/applications/:id", () => {
        return HttpResponse.json({ error: "Not found" }, { status: 404 });
      }),
    );
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("shows rejection reason field when status is Rejected", async () => {
    server.use(
      http.get("/api/applications/:id", () => {
        return HttpResponse.json({ ...mockApplication, status: "Rejected" });
      }),
    );
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    await waitFor(() => {
      expect(screen.getByText("Rejection reason")).toBeInTheDocument();
    });
  });

  it("hides rejection reason field when status is not Rejected", async () => {
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("Company")).toBeInTheDocument();
    });
    expect(screen.queryByText("Rejection reason")).not.toBeInTheDocument();
  });

  it("renders a single Save button", async () => {
    renderWithProviders(<ApplicationDetailsContent id="1" />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^save$/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /save notes/i }),
    ).not.toBeInTheDocument();
  });
});
