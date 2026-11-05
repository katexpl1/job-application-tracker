"use client";

import { Button, Table, useConfirm, useTable, useToast } from "blunt-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApplications, useDeleteApplication } from "@/lib/hooks";
import { Row } from "@/lib/models";
import { getColumns } from "../page.helpers";
import * as Styled from "../page.styles";
import { logout } from "./ApplicationsList.actions";
import { AddApplicationModal } from "@/components/AddApplicationModal/AddApplicationModal";
import type { IApplicationModel } from "@/lib/applications/applications.types";

interface IProps {
  initialData: IApplicationModel[];
}

export function ApplicationsList({ initialData }: IProps) {
  const { toast } = useToast();
  const confirm = useConfirm();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { sort, onSortChange } = useTable();

  const { data = initialData, isLoading } = useApplications(sort, initialData);
  const { mutate: deleteApplication, isPending: isDeleting } = useDeleteApplication();

  const handleDeleteApplication = async (e: React.MouseEvent, row: Row) => {
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

  const columns = getColumns(handleDeleteApplication);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      toast.error(
        `There was error logging you out. ${error instanceof Error ? error.message : ""}`,
      );
      setIsLoggingOut(false);
      return;
    }

    toast.success("Logout successful");
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <Styled.Header>
        <Styled.ButtonWithTitleWrapper>
          <Styled.AppTitle>Job Tracker</Styled.AppTitle>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add application
          </Button>
        </Styled.ButtonWithTitleWrapper>

        <Styled.ButtonsWrapper>
          <Button variant="secondary" onClick={() => router.push("/profile")} disabled={isLoggingOut}>
            Profile
          </Button>
          <Styled.LogoutButton onClick={handleLogout} isLoading={isLoggingOut} disabled={isLoggingOut}>
            Logout
          </Styled.LogoutButton>
        </Styled.ButtonsWrapper>
      </Styled.Header>

      <Styled.TableWrapper>
        <Table
          columns={columns}
          data={data as Row[]}
          loading={isLoading || isDeleting}
          emptyMessage="No applications yet"
          rowKey="id"
          stickyHeader
          pageSize={10}
          sort={sort}
          onSortChange={onSortChange}
          onRowClick={(row) => row.id && router.push(`/applications/${row.id}`)}
        />
      </Styled.TableWrapper>

      <AddApplicationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
