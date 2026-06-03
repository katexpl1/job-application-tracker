"use client";

import { Button, Table, useConfirm, useTable, useToast } from "blunt-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useApplications,
  useDeleteApplication,
} from "./lib/hooks";
import { Row } from "./lib/models";
import { getColumns } from "./page.helpers";
import * as Styled from "./page.styles";
import { supabase } from "./lib/supabase";
import { AddApplicationModal } from "./AddApplicationModal";

export default function Home() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sort, onSortChange } = useTable();

  const { data = [], isLoading } = useApplications(sort);
  const { mutate: deleteApplication, isPending: isDeleting } = useDeleteApplication();

  const handleAddApplication = () => {
    setIsModalOpen(true);
  };

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
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(`There was error logging you out. ${error}`);
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
          <Button
            variant="primary"
            onClick={handleAddApplication}
          >
            Add application
          </Button>
        </Styled.ButtonWithTitleWrapper>

        <Styled.ButtonsWrapper>
          <Button variant="secondary" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Styled.LogoutButton onClick={handleLogout}>
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
