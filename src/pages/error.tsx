import { Center, Stack, Text, Title } from "@mantine/core";
import RootLayout from "../components/layouts/RootLayout";

export function ErrorPage() {
  return (
    <RootLayout>
      <Center style={{ flexGrow: 1 }}>
        <Stack justify="center" align="center" gap="0">
          <Title order={3} size="h1">
            404
          </Title>
          <Text fw={500}>Tidak dapat menemukan halaman!</Text>
        </Stack>
      </Center>
    </RootLayout>
  );
}
