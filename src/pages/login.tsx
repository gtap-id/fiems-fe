import {
  Button,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { ClientResponseError } from "pocketbase";
import { useNavigate } from "react-router-dom";
import { pb } from "../libs/pocketbase";

type LoginFormValues = {
  name: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    initialValues: {
      name: "",
      password: "",
    },
    validate: {
      name: (value) => (!value ? "Wajib diisi" : null),
      password: (value) => (!value ? "Wajib diisi" : null),
    },
  });

  return (
    <Center mih="100vh" mah="100vh" bg="gray.1">
      <Flex
        align="center"
        justify="center"
        style={{ borderRadius: "var(--mantine-radius-md)", overflow: "hidden" }}
      >
        <Center bg="white" p="3rem">
          <Stack gap="lg">
            <Center>
              <Image src="/Logo.webp" alt="Logo FIEMS" w={116} h={68} />
            </Center>
            <Stack gap={0} ta="center">
              <Title size="h2" fw={500} c="gray.9">
                FIE
                <span style={{ color: "var(--mantine-color-brand-4)" }}>
                  MS
                </span>
              </Title>
              <Text size="sm">Management System</Text>
            </Stack>
          </Stack>
        </Center>
        <Center bg="brand" p="3rem" style={{ alignSelf: "stretch" }}>
          <form
            onSubmit={form.onSubmit((values) => {
              const notificationId = notifications.show({
                loading: true,
                title: "Mencoba login...",
                message: null,
                autoClose: false,
                withCloseButton: false,
              });

              pb.collection("users")
                .authWithPassword(values.name, values.password)
                .then(() => {
                  notifications.update({
                    id: notificationId,
                    loading: false,
                    title: "Berhasil login",
                    message: null,
                    autoClose: true,
                    withCloseButton: true,
                    color: "teal",
                    icon: <IconCheck />,
                  });
                  navigate("/");
                })
                .catch((err) => {
                  if (err instanceof ClientResponseError && err.status == 400) {
                    notifications.update({
                      id: notificationId,
                      loading: false,
                      title: "Gagal login",
                      message: "Nama atau password salah",
                      autoClose: true,
                      withCloseButton: true,
                      color: "red",
                    });
                  } else {
                    console.error(err);
                    notifications.update({
                      id: notificationId,
                      loading: false,
                      title: "Gagal login",
                      message: "Terjadi kesalahan",
                      autoClose: true,
                      withCloseButton: true,
                      color: "red",
                    });
                  }
                });
            })}
          >
            <Stack>
              <TextInput
                placeholder="Enter name"
                {...form.getInputProps("name")}
              />
              <TextInput
                type="password"
                placeholder="Enter password"
                {...form.getInputProps("password")}
              />
              <Button type="submit">Login</Button>
            </Stack>
          </form>
        </Center>
      </Flex>
    </Center>
  );
}
