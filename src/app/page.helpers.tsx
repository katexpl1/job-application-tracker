import { Badge, BadgeVariant, Button, TableColumn } from "blunt-ui";
import { Row } from "@/lib/models";
import { ApplicationStatus } from "@/lib/applications/applications.consts";

const STATUS_VARIANTS: Record<ApplicationStatus, BadgeVariant> = {
  [ApplicationStatus.Applied]: "info",
  [ApplicationStatus.InReview]: "warning",
  [ApplicationStatus.Interview]: "primary",
  [ApplicationStatus.Offer]: "success",
  [ApplicationStatus.Rejected]: "error",
};

export function getColumns(
  onDelete: (e: React.MouseEvent, row: Row) => void,
): TableColumn<Row>[] {
  return [
    { key: "companyName", header: "Company name", width: "150px", sortable: true },
    { key: "appliedRole", header: "Applied role", width: "160px", sortable: true },
    { key: "location", header: "Location", width: "120px", sortable: true },
    {
      key: "jobType",
      header: "Job type",
      width: "110px",
      sortable: true,
      render: (value) =>
        value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : null,
    },
    { key: "dateApplied", header: "Date applied", width: "120px", sortable: true },
    {
      key: "source",
      header: "Source",
      width: "130px",
      sortable: true,
      render: (value) =>
        value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : null,
    },
    { key: "salaryRange", header: "Salary range", width: "170px", sortable: true },
    {
      key: "status",
      header: "Status",
      width: "110px",
      sortable: true,
      render: (value) =>
        value ? (
          <Badge variant={STATUS_VARIANTS[String(value) as ApplicationStatus] ?? "neutral"}>
            {String(value)}
          </Badge>
        ) : null,
    },
    {
      key: "id",
      header: "",
      width: "80px",
      render: (_, row) =>
        row.id ? (
          <Button variant="outline" onClick={(e) => onDelete(e, row)}>
            Delete
          </Button>
        ) : null,
    },
  ];
}
