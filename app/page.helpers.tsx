import { Button, TableColumn } from "blunt-ui";
import { Row } from "./lib/models";

export function getColumns(
  onDelete: (e: React.MouseEvent, row: Row) => void,
): TableColumn<Row>[] {
  return [
    { key: "companyName", header: "Company name", width: "150px" },
    { key: "appliedRole", header: "Applied role", width: "160px" },
    { key: "location", header: "Location", width: "120px" },
    { key: "jobType", header: "Job type", width: "110px" },
    { key: "dateApplied", header: "Date applied", width: "120px" },
    { key: "source", header: "Source", width: "130px" },
    { key: "salaryRange", header: "Salary range", width: "170px" },
    { key: "status", header: "Status", width: "110px" },
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
