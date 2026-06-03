import { Badge, BadgeVariants, Button, TableColumn } from "blunt-ui";
import { Row } from "./lib/models";

const STATUS_VARIANTS: Record<string, BadgeVariants> = {
  Applied: "info",
  "In review": "warning",
  Interview: "primary",
  Offer: "success",
  Rejected: "error",
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
          <Badge variant={STATUS_VARIANTS[String(value)] ?? "neutral"}>
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
