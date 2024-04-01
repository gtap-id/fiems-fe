import {
  Button,
  Flex,
  Group,
  Input,
  Menu,
  Modal,
  MultiSelect,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  useSafeMantineTheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure, useResizeObserver } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconFileExport,
  IconFilePlus,
  IconFilter,
  IconListNumbers,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../../../hooks/useTable";
import { pb } from "../../../libs/pocketbase";
import { CustomerModel } from "../../../resources/customer";
import { exportCSV } from "../../../utils/data";
import {
  PocketbaseFilterBuilder,
  transformCamelToTitle,
} from "../../../utils/strings";

type FilterModalProps = {
  open: boolean;
  onClose: () => void;

  onChange: (filter: string) => void;
};

function FilterModal(props: Readonly<FilterModalProps>) {
  const [filter, setFilter] = useState("");
  useEffect(() => {
    props.onChange(filter);
  }, [props, filter]);

  const form = useForm({
    initialValues: {
      createDate: "All",
      rangeCreateDate: [],
      types: ["Shipper", "Vendor", "Shipping"],
      status: "All",
    },
    onValuesChange: (values) => {
      const builder = new PocketbaseFilterBuilder();
      if (values.createDate === "Today") {
        builder.addFilter("created >= {:a}", {
          a: dayjs().startOf("day").toDate(),
        });
      } else if (values.createDate === "Yesterday") {
        builder
          .addFilter("created >= {:a}", {
            a: dayjs().subtract(1, "day").startOf("day").toDate(),
          })
          .addFilter("created <= {:b}", {
            b: dayjs().subtract(1, "day").endOf("day").toDate(),
          });
      } else if (values.createDate === "This Week") {
        builder.addFilter("created >= {:a}", {
          a: dayjs().startOf("week").toDate(),
        });
      } else if (values.createDate === "This Month") {
        builder.addFilter("created >= {:a}", {
          a: dayjs().startOf("month").toDate(),
        });
      } else if (values.createDate === "This Year") {
        builder.addFilter("created >= {:a}", {
          a: dayjs().startOf("year").toDate(),
        });
      } else if (
        values.createDate === "Custom" &&
        values.rangeCreateDate[0] &&
        values.rangeCreateDate[1]
      ) {
        builder
          .addFilter("created >= {:a} && <= {:b}", {
            a: dayjs(values.rangeCreateDate[0]).startOf("day").toDate(),
          })
          .addFilter("created <= {:b}", {
            b: dayjs(values.rangeCreateDate[1]).endOf("day").toDate(),
          });
      }

      const typeBuilder = new PocketbaseFilterBuilder();
      for (const t of values.types) {
        if (t === "Shipper") {
          typeBuilder.addFilter(`type = "shipper"`);
        } else if (t === "Vendor") {
          typeBuilder.addFilter(`type = "vendor"`);
        } else if (t === "Shipping") {
          typeBuilder.addFilter(`type = "shipping"`);
        }
      }
      builder.addGroup(typeBuilder, undefined, "||");

      if (values.status === "Active") {
        builder.addFilter("status = true");
      } else if (values.status === "Inactive") {
        builder.addFilter("status = false");
      }

      setFilter(builder.build(values));
    },
  });

  return (
    <Modal opened={props.open} onClose={props.onClose} title="Filter">
      <Stack gap="xs">
        <Select
          label="Create Date"
          placeholder="Select create date"
          data={[
            "All",
            "Today",
            "Yesterday",
            "This Week",
            "This Month",
            "This Year",
            "Custom",
          ]}
          {...form.getInputProps("createDate")}
        />
        {form.values.createDate === "Custom" && (
          <DatePickerInput
            type="range"
            placeholder="Pick Range"
            {...form.getInputProps("rangeCreateDate")}
          />
        )}
        <MultiSelect
          defaultValue={["Shipper", "Vendor", "Shipping"]}
          label="Type"
          placeholder="Select type"
          data={["Shipper", "Vendor", "Shipping"]}
          {...form.getInputProps("types")}
        />
        <Select
          defaultValue="All"
          label="Status"
          placeholder="Select status"
          data={["All", "Active", "Inactive"]}
          {...form.getInputProps("status")}
        />
      </Stack>
    </Modal>
  );
}

export function CustomerReportPage() {
  const navigate = useNavigate();

  const theme = useSafeMantineTheme();

  const [filter, setFilter] = useState("");

  const table = useTable<CustomerModel>({
    columns: [
      { name: "created", type: "date", header: "Create Date" },
      {
        name: "type",
        type: "text",
        header: "Type",
        onFormat: (type) => {
          switch (type as CustomerModel["type"]) {
            case "shipper":
              return "Shipper";
            case "vendor":
              return "Vendor";
            case "shipping":
              return "Shipping";
          }
        },
      },
      {
        name: "code",
        type: "code",
        header: "Code",
        onClick: (row) => {
          navigate(`/master-data/customer/save?id=${row.id}`);
        },
      },
      { name: "expand.group.code", type: "text", header: "Group" },
      { name: "name", type: "text", header: "Name" },
      { name: "address", type: "text", header: "Address" },
      { name: "province", type: "text", header: "Province" },
      { name: "city", type: "text", header: "City" },
      { name: "npwp", type: "text", header: "NPWP" },
      { name: "telephone", type: "text", header: "Telephone" },
      { name: "fax", type: "text", header: "Fax" },
      { name: "email", type: "text", header: "Email" },
      { name: "top", type: "text", header: "TOP" },
      { name: "currency", type: "text", header: "Currency" },
    ],
    source: (page, perPage, sort) => {
      return pb
        .collection<CustomerModel>("customers")
        .getList(page, perPage, { sort, filter, expand: "group" });
    },
    status: true,
    actions: [
      {
        icon: IconEdit,
        color: "blue.7",
        name: "Edit",
        onClick: (row) => {
          navigate(`/master-data/customer/save?id=${row.id}`);
        },
      },
      {
        icon: IconTrash,
        color: "red.7",
        name: "Delete",
        onClick: (row) => {
          modals.openConfirmModal({
            size: "sm",
            title: "Delete confirmation",
            children: (
              <Text c="gray.8" fw="500" size="sm">
                Yakin ingin menghapus data ini?
              </Text>
            ),
            confirmProps: {
              size: "xs",
            },
            cancelProps: {
              c: "brand",
              size: "xs",
            },
            labels: {
              confirm: "Yes",
              cancel: "No",
            },
            onConfirm: () => {
              const notificationId = notifications.show({
                loading: true,
                title: "Menghapus...",
                message: null,
                autoClose: false,
                withCloseButton: false,
              });

              pb.collection("customers")
                .delete(row.id)
                .then(() => {
                  notifications.update({
                    id: notificationId,
                    loading: false,
                    title: "Berhasil terhapus",
                    message: null,
                    autoClose: true,
                    withCloseButton: true,
                    color: "teal",
                    icon: <IconCheck />,
                  });
                  table.reload();
                })
                .catch((err) => {
                  console.error(err);
                  notifications.update({
                    id: notificationId,
                    loading: false,
                    title: "Gagal terhapus",
                    message: "Terjadi kesalahan",
                    autoClose: true,
                    withCloseButton: true,
                    color: "red",
                  });
                });
            },
          });
        },
      },
    ],
  });

  const [mainContainerRef, mainContainerRect] = useResizeObserver();
  const [mainTopRef, mainTopRect] = useResizeObserver();
  const [paginationRef, paginationRect] = useResizeObserver();

  const tableScrollMaxHeight = useMemo(() => {
    if (
      !mainContainerRect.height ||
      !mainTopRect.height ||
      !paginationRect.height
    )
      return -1;
    return `calc(${mainContainerRect.height}px - ${mainTopRect.height}px - ${paginationRect.height}px - ${theme.spacing.md} - ${theme.spacing.md} - 1px)`;
  }, [
    mainContainerRect.height,
    mainTopRect.height,
    paginationRect.height,
    theme.spacing.md,
  ]);

  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  return (
    <>
      <Stack style={{ flexGrow: 1 }}>
        <Flex
          justify="space-between"
          p="sm"
          style={{
            borderRadius: "var(--mantine-radius-md)",
            boxShadow: "var(--mantine-shadow-sm)",
          }}
          bg="white"
        >
          <Input
            size="xs"
            placeholder="Search"
            radius="md"
            variant="filled"
            leftSection={<IconSearch size="16" />}
            value={table.search}
            onChange={(e) => table.setSearch(e.currentTarget.value)}
          />
          <Group gap="xs">
            <Button
              radius="md"
              rightSection={<IconFilePlus size={16} />}
              size="xs"
              onClick={() => navigate("/master-data/customer/save")}
            >
              Add New Customer
            </Button>
            <Button
              variant="outline"
              radius="md"
              rightSection={<IconFileExport size={16} />}
              size="xs"
              onClick={async () => {
                await exportCSV<CustomerModel>(
                  table.rows,
                  "Data Customer.csv",
                  (row) => {
                    console.log(row);
                    return {
                      type: row.type,
                      code: row.code,
                      group: row.expand?.group?.code,
                      name: row.name,
                      address: row.address,
                      province: row.province,
                      city: row.city,
                      telephone: row.telephone,
                      fax: row.fax,
                      email: row.email,
                      top: row.top,
                      currency: row.currency,
                      status: row.status ? "Active" : "Inactive",
                      created: row.created,
                      updated: row.updated,
                    };
                  }
                );
              }}
            >
              Export
            </Button>
          </Group>
        </Flex>
        <Flex
          ref={mainContainerRef}
          direction="column"
          p="sm"
          style={{
            flexGrow: 1,
            borderRadius: "var(--mantine-radius-md)",
          }}
          bg="white"
          gap="md"
        >
          <Flex ref={mainTopRef} justify="space-between" align="center">
            <Group></Group>
            <Group gap="sm">
              <Button
                variant="outline"
                size="xs"
                c="gray.8"
                fw="600"
                leftSection={<IconFilter size={16} />}
                styles={{
                  section: {
                    marginRight: "4px",
                  },
                }}
                onClick={() => openFilterModal()}
              >
                Filter
              </Button>
              <Menu shadow="md" closeOnItemClick={false}>
                <Menu.Target>
                  <Button
                    variant="outline"
                    size="xs"
                    c="gray.8"
                    fw="600"
                    leftSection={<IconEye size={16} />}
                    styles={{
                      section: {
                        marginRight: "4px",
                      },
                    }}
                  >
                    Visibility
                  </Button>
                </Menu.Target>
                <Menu.Dropdown mah={200} style={{ overflow: "auto" }}>
                  {table.headers.map((header) => (
                    <Menu.Item
                      key={header.key}
                      onClick={() => {
                        if (header.visible) table.hide(header.key);
                        else table.unhide(header.key);
                      }}
                      leftSection={
                        <IconCheck
                          size={16}
                          style={{
                            visibility: header.visible ? "visible" : "hidden",
                          }}
                        />
                      }
                    >
                      {transformCamelToTitle(header.text)}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
              <Menu shadow="md" closeOnItemClick={false}>
                <Menu.Target>
                  <Button
                    variant="outline"
                    size="xs"
                    c="gray.8"
                    fw="600"
                    leftSection={<IconListNumbers size={16} />}
                    styles={{
                      section: {
                        marginRight: "4px",
                      },
                    }}
                  >
                    Show
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {[10, 25, 50].map((total) => (
                    <Menu.Item
                      bg={
                        total === table.pageState.perPage
                          ? "brand.0"
                          : "transparent"
                      }
                      key={total}
                      onClick={() => table.setPerPage(total)}
                    >
                      {total}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Flex>
          <ScrollArea.Autosize
            type="auto"
            h={tableScrollMaxHeight}
            mah={tableScrollMaxHeight}
            maw={mainContainerRect.width - 1}
            styles={{ scrollbar: { zIndex: 10 } }}
            style={{
              borderTopLeftRadius: "var(--mantine-radius-md)",
              borderTopRightRadius: "var(--mantine-radius-md)",
            }}
            offsetScrollbars={false}
          >
            <Table stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  {table.headers
                    .filter((header) => header.visible)
                    .map((header) => header.node)}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {table.rows.map((row) => {
                  return (
                    <Table.Tr key={row.key}>
                      {row.cells
                        .filter((cell) => cell.visible)
                        .map((cell) => cell.node)}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea.Autosize>
          <Pagination
            ref={paginationRef}
            value={table.pageState.page}
            onChange={table.setPage}
            total={table.pageCount}
          />
        </Flex>
      </Stack>
      <FilterModal
        open={filterModalOpened}
        onClose={() => {
          closeFilterModal();
          table.reload();
        }}
        onChange={(filter) => {
          setFilter(filter);
        }}
      />
    </>
  );
}
