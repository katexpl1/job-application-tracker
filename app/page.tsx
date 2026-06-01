"use client";

import { Button, Table, TableColumn, useConfirm, useToast } from "blunt-ui";
import { useRouter } from "next/navigation";
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
} from "./lib/hooks";
import { Row } from "./lib/models";
import * as Styled from "./page.styles";
import { supabase } from "./lib/supabase";

export default function Home() {
  const { data = [], isLoading } = useApplications();
  const { toast } = useToast();
  const { mutate: createApplication, isPending: isCreating } =
    useCreateApplication();
  const { mutate: deleteApplication } = useDeleteApplication();
  const confirm = useConfirm();
  const router = useRouter();

  const handleAdd = () => {
    createApplication(
      { companyName: "New application", appliedRole: "Role" },
      { onSuccess: (created) => router.push(`/applications/${created.id}`) },
    );
  };

  const handleDelete = async (e: React.MouseEvent, row: Row) => {
    e.stopPropagation();
    const ok = await confirm({
      title: "Delete application",
      message: `Delete ${row.companyName}?`,
      confirmLabel: "Delete",
      variant: "danger",
    });

    if (ok) {
      deleteApplication(row.id!);
    }
  };

  const columns: TableColumn<Row>[] = [
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
          <Button variant="outline" onClick={(e) => handleDelete(e, row)}>
            Delete
          </Button>
        ) : null,
    },
  ];
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(`There was error logging you out. ${error}`);
      return;
    }

    toast.success("Logout successfull");

    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <Styled.Header>
        <Styled.AppTitle>Job Tracker</Styled.AppTitle>
        <Button variant="primary" onClick={handleAdd} isLoading={isCreating}>
          Add application
        </Button>

        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Styled.Header>
      <Styled.TableWrapper>
        <Table
          columns={columns}
          data={data as Row[]}
          loading={isLoading}
          emptyMessage="No applications yet"
          rowKey="id"
          stickyHeader
          onRowClick={(row) => row.id && router.push(`/applications/${row.id}`)}
        />
      </Styled.TableWrapper>
    </>
  );
}
