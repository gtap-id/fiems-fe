import {
  Button,
  Flex,
  Group,
  ScrollArea,
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
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCode } from "../../../hooks/useCode";
import { pb } from "../../../libs/pocketbase";

export function ShipperGroupSavePage() {
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
      name: "",
      description: "",
    },
    validate: {
      name: (value) => {
        if (!value.trim()) {
          return "Wajib diisi";
        }
      },
    },
  });

  const idParam = useMemo(() => searchParams.get("id"), [searchParams]);
  const code = useCode("shipper_groups", "GROUP");
  useEffect(() => {
    if (idParam) {
      pb.collection("shipper_groups")
        .getOne(idParam)
        .then((data) => {
          form.initialize({
            createDate: new Date(data.created),
            code: data.code,
            name: data.name,
            description: data.description,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (form.values.code === "" && code) {
      form.setFieldValue("code", code);
    }
  }, [code, form, idParam]);

  return (
    <form
      style={{ display: "flex", flexGrow: 1 }}
      noValidate
      onSubmit={form.onSubmit(async (values) => {
        const notificationId = notifications.show({
          loading: true,
          title: "Menyimpan...",
          message: null,
          autoClose: false,
          withCloseButton: false,
        });

        const collection = pb.collection("shipper_groups");
        const recordModel = idParam
          ? collection.update(idParam, {
              name: values.name,
              description: values.description,
            })
          : collection.create({
              code: values.code,
              name: values.name,
              description: values.description,
              status: true,
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
            navigate("/master-data/shipper-group");
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
            Shipper Group
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
                navigate("/master-data/shipper-group");
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
                    value="GROUP0001"
                    {...form.getInputProps("code")}
                  />
                  <TextInput
                    label="Name"
                    required
                    autoComplete="off"
                    {...form.getInputProps("name")}
                    onInput={(e) => {
                      e.currentTarget.value =
                        e.currentTarget.value.toUpperCase();
                    }}
                  />
                  <TextInput
                    label="Description"
                    autoComplete="off"
                    {...form.getInputProps("description")}
                    onInput={(e) => {
                      e.currentTarget.value =
                        e.currentTarget.value.toUpperCase();
                    }}
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
