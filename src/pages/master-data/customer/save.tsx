import {
  Button,
  Flex,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  TextInput,
  Title,
  useSafeMantineTheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useElementSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconCheck, IconCircleX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCode } from "../../../hooks/useCode";
import { pb } from "../../../libs/pocketbase";
import { CustomerType } from "../../../resources/customer";
import { ShipperGroupModel } from "../../../resources/shipper_groups";
import {
  autoCap,
  isEmail,
  isFax,
  isTelephone,
  isValidNPWP,
  onlyNPWP,
  onlyNumber,
} from "../../../utils/validations";

export function CustomerSavePage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const theme = useSafeMantineTheme();

  const {
    ref: mainContainerRef,
    height: mainContainerHeight,
    width: mainContainerWidth,
  } = useElementSize();

  const form = useForm({
    initialValues: {
      createDate: new Date(),
      code: "",
      type: "shipper",
      group: "",
      name: "",
      address: "",
      province: "",
      city: "",
      npwp: "",
      telephone: "",
      fax: "",
      email: "",
      top: 0,
      currency: "",
      purchasingName: "",
      purchasingEmail: "",
      purchasingTelephone: "",
      purchasingFax: "",
      operationName: "",
      operationEmail: "",
      operationTelephone: "",
      operationFax: "",
      financeName: "",
      financeEmail: "",
      financeTelephone: "",
      financeFax: "",
    },
    validate: {
      type: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      name: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      address: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      province: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      city: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      npwp: (value) => {
        if (value.trim() != "" && !isValidNPWP(value)) {
          return "Format tidak valid";
        }
      },
      telephone: (value) => {
        if (value.trim() != "" && !isTelephone(value)) {
          return "Format tidak valid";
        }
      },
      fax: (value) => {
        if (value.trim() != "" && !isFax(value)) {
          return "Format tidak valid";
        }
      },
      email: (value) => {
        if (value.trim() != "" && !isEmail(value)) {
          return "Format tidak valid";
        }
      },
      top: (value) => {
        if (value < 0) {
          return "Minimal 0";
        }
      },
      currency: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
      purchasingEmail: (value) => {
        if (value.trim() != "" && !isEmail(value)) {
          return "Format tidak valid";
        }
      },
      purchasingTelephone: (value) => {
        if (value.trim() != "" && !isTelephone(value)) {
          return "Format tidak valid";
        }
      },
      purchasingFax: (value) => {
        if (value.trim() != "" && !isFax(value)) {
          return "Format tidak valid";
        }
      },
      operationEmail: (value) => {
        if (value.trim() != "" && !isEmail(value)) {
          return "Format tidak valid";
        }
      },
      operationTelephone: (value) => {
        if (value.trim() != "" && !isTelephone(value)) {
          return "Format tidak valid";
        }
      },
      operationFax: (value) => {
        if (value.trim() != "" && !isFax(value)) {
          return "Format tidak valid";
        }
      },
      financeEmail: (value) => {
        if (value.trim() != "" && !isEmail(value)) {
          return "Format tidak valid";
        }
      },
      financeTelephone: (value) => {
        if (value.trim() != "" && !isTelephone(value)) {
          return "Format tidak valid";
        }
      },
      financeFax: (value) => {
        if (value.trim() != "" && !isFax(value)) {
          return "Format tidak valid";
        }
      },
    },
  });

  const [groups, setGroups] = useState<ShipperGroupModel[]>([]);
  useEffect(() => {
    pb.collection<ShipperGroupModel>("shipper_groups")
      .getFullList()
      .then((records) => setGroups(records))
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Gagal memuat data",
          message: "Terjadi kesalahan ketika mengambil data shipper group",
          autoClose: true,
          withCloseButton: true,
          color: "red",
        });
      });
  }, []);

  const idParam = useMemo(() => searchParams.get("id"), [searchParams]);
  const code = useCode(
    "customers",
    useMemo(() => {
      return (form.values.type as CustomerType).toUpperCase();
    }, [form.values.type])
  );
  useEffect(() => {
    if (idParam) {
      pb.collection("customers")
        .getOne(idParam)
        .then((data) => {
          form.initialize({
            createDate: new Date(data.created),
            code: data.code,
            type: data.type,
            group: data.group,
            name: data.name,
            address: data.address,
            province: data.province,
            city: data.city,
            npwp: data.npwp,
            telephone: data.telephone,
            fax: data.fax,
            email: data.email,
            top: data.top,
            currency: data.currency,
            purchasingName: data.purchasingName,
            purchasingEmail: data.purchasingEmail,
            purchasingTelephone: data.purchasingTelephone,
            purchasingFax: data.purchasingFax,
            operationName: data.operationName,
            operationEmail: data.operationEmail,
            operationTelephone: data.operationTelephone,
            operationFax: data.operationFax,
            financeName: data.financeName,
            financeEmail: data.financeEmail,
            financeTelephone: data.financeTelephone,
            financeFax: data.financeFax,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (form.values.code !== code && code) {
      form.setFieldValue("code", code);
    }
  }, [code, form, idParam]);

  return (
    <form
      style={{ display: "flex", flexGrow: 1 }}
      noValidate
      onSubmit={form.onSubmit(function (values) {
        const notificationId = notifications.show({
          loading: true,
          title: "Menyimpan...",
          message: null,
          autoClose: false,
          withCloseButton: false,
        });

        const collection = pb.collection("customers");
        const recordModel = idParam
          ? collection.update(idParam, {
              type: values.type,
              group: values.group,
              name: values.name,
              address: values.address,
              province: values.province,
              city: values.city,
              npwp: values.npwp,
              telephone: values.telephone,
              fax: values.fax,
              email: values.email,
              top: values.top,
              currency: values.currency,
              purchasingName: values.purchasingName,
              purchasingEmail: values.purchasingEmail,
              purchasingTelephone: values.purchasingTelephone,
              purchasingFax: values.purchasingFax,
              operationName: values.operationName,
              operationEmail: values.operationEmail,
              operationTelephone: values.operationTelephone,
              operationFax: values.operationFax,
              financeName: values.financeName,
              financeEmail: values.financeEmail,
              financeTelephone: values.financeTelephone,
              financeFax: values.financeFax,
            })
          : collection.create({
              code: values.code,
              type: values.type,
              group: values.type === "shipper" ? values.group : "",
              name: values.name,
              address: values.address,
              province: values.province,
              city: values.city,
              npwp: values.npwp,
              telephone: values.telephone,
              fax: values.fax,
              email: values.email,
              top: values.top,
              currency: values.currency,
              status: true,
              purchasingName: values.purchasingName,
              purchasingEmail: values.purchasingEmail,
              purchasingTelephone: values.purchasingTelephone,
              purchasingFax: values.purchasingFax,
              operationName: values.operationName,
              operationEmail: values.operationEmail,
              operationTelephone: values.operationTelephone,
              operationFax: values.operationFax,
              financeName: values.financeName,
              financeEmail: values.financeEmail,
              financeTelephone: values.financeTelephone,
              financeFax: values.financeFax,
            });

        recordModel
          .then(() => {
            notifications.update({
              id: notificationId,
              loading: false,
              title: "Berhasil tersimpan",
              message: null,
              autoClose: true,
              withCloseButton: true,
              color: "teal",
              icon: <IconCheck />,
            });
            navigate("/master-data/customer");
          })
          .catch((err) => {
            console.error(err);
            notifications.update({
              id: notificationId,
              loading: false,
              title: "Gagal tersimpan",
              message: "Terjadi kesalahan",
              autoClose: true,
              withCloseButton: true,
              color: "red",
            });
          });
      })}
    >
      <Stack style={{ flexGrow: 1 }}>
        <Flex
          justify="space-between"
          p="sm"
          style={{
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.md,
          }}
          bg="white"
        >
          <Title size="h4" c="gray.9">
            Customer
          </Title>
          <Group gap="xs">
            <Button
              variant="outline"
              radius="md"
              rightSection={<IconCircleX size={16} />}
              size="xs"
              color="gray"
              c="gray.6"
              onClick={() => {
                navigate("/master-data/customer");
              }}
            >
              Cancel
            </Button>
            <Button
              radius="md"
              rightSection={<IconArrowRight size={16} />}
              size="xs"
              type="submit"
            >
              Save
            </Button>
          </Group>
        </Flex>
        <Flex
          ref={mainContainerRef}
          direction="column"
          p="sm"
          style={{
            flexGrow: 1,
            borderRadius: theme.radius.md,
          }}
          bg="white"
          gap="md"
        >
          <ScrollArea.Autosize
            type="auto"
            h={mainContainerHeight - 1}
            mah={mainContainerHeight - 1}
            maw={mainContainerWidth - 1}
            style={{
              border: `1px solid ${theme.colors.gray[3]}`,
              borderRadius: theme.radius.md,
            }}
            p="xs"
            offsetScrollbars
          >
            <Tabs defaultValue="generalInformation">
              <Tabs.List>
                <Tabs.Tab value="generalInformation">
                  General Information
                </Tabs.Tab>
                <Tabs.Tab value="purchasing">Purchasing</Tabs.Tab>
                <Tabs.Tab value="operation">Operation</Tabs.Tab>
                <Tabs.Tab value="finance">Finance</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="generalInformation" pt="md">
                <SimpleGrid cols={{ xs: 1, lg: 2 }}>
                  <DatePickerInput
                    label="Create Date"
                    disabled
                    value={new Date()}
                    {...form.getInputProps("createDate")}
                  />
                  <TextInput
                    label="Code"
                    disabled
                    {...form.getInputProps("code")}
                  />
                  <Select
                    label="Type"
                    required
                    data={[
                      { label: "Shipper", value: "shipper" },
                      { label: "Vendor", value: "vendor" },
                      { label: "Shipping", value: "shipping" },
                    ]}
                    {...form.getInputProps("type")}
                  />
                  {form.values.type === "shipper" && (
                    <Select
                      label="Group"
                      required
                      data={groups.map((group) => ({
                        label: `${group.code} | ${group.name}`,
                        value: group.id,
                      }))}
                      {...form.getInputProps("group")}
                    />
                  )}
                  <TextInput
                    label="Name"
                    required
                    autoComplete="off"
                    {...form.getInputProps("name")}
                    onInput={autoCap}
                  />
                  <TextInput
                    label="Address"
                    required
                    autoComplete="off"
                    {...form.getInputProps("address")}
                    onInput={autoCap}
                  />
                  <TextInput
                    label="Province"
                    required
                    autoComplete="off"
                    {...form.getInputProps("province")}
                    onInput={autoCap}
                  />
                  <TextInput
                    label="City"
                    required
                    autoComplete="off"
                    {...form.getInputProps("city")}
                    onInput={autoCap}
                  />
                  <TextInput
                    label="NPWP"
                    autoComplete="off"
                    {...form.getInputProps("npwp")}
                    onInput={onlyNPWP}
                    placeholder="Format: XX.YYY.YYY-Z.XXX.YYY"
                  />
                  <TextInput
                    type="tel"
                    label="Telephone"
                    autoComplete="off"
                    {...form.getInputProps("telephone")}
                    onInput={onlyNumber}
                  />
                  <TextInput
                    type="tel"
                    label="Fax"
                    autoComplete="off"
                    {...form.getInputProps("fax")}
                    onInput={onlyNumber}
                  />
                  <TextInput
                    type="email"
                    label="Email"
                    autoComplete="off"
                    {...form.getInputProps("email")}
                  />
                  <NumberInput
                    label="TOP"
                    min={0}
                    {...form.getInputProps("top")}
                  />
                  <TextInput
                    label="Currency"
                    required
                    autoComplete="off"
                    {...form.getInputProps("currency")}
                    onInput={autoCap}
                  />
                </SimpleGrid>
              </Tabs.Panel>
              <Tabs.Panel value="purchasing" pt="md">
                <SimpleGrid cols={{ xs: 1, lg: 2 }}>
                  <TextInput
                    label="Name"
                    autoComplete="off"
                    {...form.getInputProps("purchasingName")}
                    onInput={autoCap}
                  />
                  <TextInput
                    type="email"
                    label="Email"
                    autoComplete="off"
                    {...form.getInputProps("purchasingEmail")}
                  />
                  <TextInput
                    type="tel"
                    label="Telephone"
                    autoComplete="off"
                    {...form.getInputProps("purchasingTelephone")}
                    onInput={onlyNumber}
                  />
                  <TextInput
                    type="tel"
                    label="Fax"
                    autoComplete="off"
                    {...form.getInputProps("purchasingFax")}
                    onInput={onlyNumber}
                  />
                </SimpleGrid>
              </Tabs.Panel>
              <Tabs.Panel value="operation" pt="md">
                <SimpleGrid cols={{ xs: 1, lg: 2 }}>
                  <TextInput
                    label="Name"
                    autoComplete="off"
                    {...form.getInputProps("operationName")}
                    onInput={autoCap}
                  />
                  <TextInput
                    type="email"
                    label="Email"
                    autoComplete="off"
                    {...form.getInputProps("operationEmail")}
                  />
                  <TextInput
                    type="tel"
                    label="Telephone"
                    autoComplete="off"
                    {...form.getInputProps("operationTelephone")}
                    onInput={onlyNumber}
                  />
                  <TextInput
                    type="tel"
                    label="Fax"
                    autoComplete="off"
                    {...form.getInputProps("operationFax")}
                    onInput={onlyNumber}
                  />
                </SimpleGrid>
              </Tabs.Panel>
              <Tabs.Panel value="finance" pt="md">
                <SimpleGrid cols={{ xs: 1, lg: 2 }}>
                  <TextInput
                    label="Name"
                    autoComplete="off"
                    {...form.getInputProps("financeName")}
                    onInput={autoCap}
                  />
                  <TextInput
                    type="email"
                    label="Email"
                    autoComplete="off"
                    {...form.getInputProps("financeEmail")}
                  />
                  <TextInput
                    type="tel"
                    label="Telephone"
                    autoComplete="off"
                    {...form.getInputProps("financeTelephone")}
                    onInput={onlyNumber}
                  />
                  <TextInput
                    type="tel"
                    label="Fax"
                    autoComplete="off"
                    {...form.getInputProps("financeFax")}
                    onInput={onlyNumber}
                  />
                </SimpleGrid>
              </Tabs.Panel>
            </Tabs>
          </ScrollArea.Autosize>
        </Flex>
      </Stack>
    </form>
  );
}
