import {
  ActionIcon,
  AppShell,
  Avatar,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import {
  Icon,
  IconBell,
  IconChartBar,
  IconDatabase,
  IconDoorExit,
  IconInfoCircleFilled,
  IconMoon,
  IconSettings,
} from "@tabler/icons-react";
import {
  Fragment,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { pb } from "../../libs/pocketbase";

type Link = {
  id: string;
  label: string;
  icon: Icon;
  childrens: {
    id: string;
    label: string;
    url: string;
  }[];
};

const links: Link[] = [
  {
    id: "masterData",
    label: "Master Data",
    icon: IconDatabase,
    childrens: [
      {
        id: "shipperGroup",
        label: "Shipper Group",
        url: "/master-data/shipper-group",
      },
      {
        id: "customer",
        label: "Customer",
        url: "/master-data/customer",
      },
      {
        id: "route",
        label: "Route",
        url: "/master-data/route",
      },
      {
        id: "port",
        label: "Port",
        url: "/master-data/port",
      },
      {
        id: "sales",
        label: "Sales",
        url: "/master-data/sales",
      },
      {
        id: "vehicle",
        label: "Vehicle",
        url: "/master-data/vehicle",
      },
      {
        id: "vessel",
        label: "Vessel",
        url: "/master-data/vessel",
      },
      {
        id: "priceShipper",
        label: "Price Shipper",
        url: "/master-data/price-shipper",
      },
      {
        id: "priceVendor",
        label: "Price Vendor",
        url: "/master-data/price-vendor",
      },
      {
        id: "priceShipping",
        label: "Price Shipping",
        url: "/master-data/price-shipping",
      },
      {
        id: "uangJalan",
        label: "Uang Jalan",
        url: "/master-data/uang-jalan",
      },
      {
        id: "uangMuat",
        label: "Uang Muat",
        url: "/master-data/uang-muat",
      },
      {
        id: "productCategory",
        label: "Product Category",
        url: "/master-data/product-category",
      },
      {
        id: "product",
        label: "Product",
        url: "/master-data/product",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: IconChartBar,
    childrens: [
      {
        id: "priceCalculation",
        label: "Price Calculation",
        url: "/marketing/price-calculation",
      },
      {
        id: "formQuotation",
        label: "Form Quotation",
        url: "/marketing/form-quotation",
      },
      {
        id: "inquiryContainer",
        label: "Inquiry Container",
        url: "/marketing/inquiry-container",
      },
      {
        id: "vesselSchedule",
        label: "Vessel Schedule",
        url: "/marketing/vessel-schedule",
      },
    ],
  },
  {
    id: "operational",
    label: "Operational",
    icon: IconSettings,
    childrens: [
      {
        id: "inquiryContainer",
        label: "Inquiry Container",
        url: "/operational/inquiry-container",
      },
      {
        id: "jobOrder",
        label: "Job Order",
        url: "/operational/job-order",
      },
      {
        id: "suratPerintahMuat",
        label: "Surat Perintah Muat",
        url: "/operational/surat-perintah-muat",
      },
      {
        id: "suratJalan",
        label: "Surat Jalan",
        url: "/operational/surat-jalan",
      },
      {
        id: "bast",
        label: "BAST",
        url: "/operational/bast",
      },
      {
        id: "packingList",
        label: "Packing List",
        url: "/operational/packing-list",
      },
      {
        id: "insurance",
        label: "Insurance",
        url: "/operational/insurance",
      },
      {
        id: "shippingInstruction",
        label: "Shipping Instruction",
        url: "/operational/shipping-instruction",
      },
      {
        id: "vesselSchedule",
        label: "Vessel Schedule",
        url: "/operational/vessel-schedule",
      },
      {
        id: "dooring",
        label: "Dooring",
        url: "/operational/dooring",
      },
      {
        id: "request",
        label: "Request",
        url: "/operational/request",
      },
    ],
  },
];

export default function RootLayout({ children }: PropsWithChildren) {
  const [linkActived, setLinkActived] = useState<string[]>([]);
  const [linksOpened, setLinksOpened] = useState<string[]>([]);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (location) {
      links.find((link) => {
        return link.childrens.find((linkChildren) => {
          if (location.pathname.startsWith(linkChildren.url)) {
            setLinkActived([link.id, linkChildren.id]);
            return true;
          }
          return false;
        });
      });
    }
  }, [location]);

  useEffect(() => {
    setLinksOpened(linkActived);
  }, [linkActived]);

  const [navLinksRef, navLinksRect] = useResizeObserver();
  const [profileRef, profileRect] = useResizeObserver();

  const navScrollMaxHeight = useMemo(() => {
    if (!navLinksRef || !profileRef) return -1;

    return `calc(${navLinksRect.height}px - ${profileRect.height}px - 8px)`;
  }, [navLinksRect.height, navLinksRef, profileRect.height, profileRef]);

  return (
    <AppShell>
      <AppShell.Header>
        <Flex justify="space-between" align="center">
          <Flex p="xs" align="center" gap="xs">
            <div id="logoFIEMS" />
            <Title order={1} size="24px">
              FIEMS
            </Title>
          </Flex>
          <Title order={1} size="h2" c="blue.1">
            Dashboard
          </Title>
          <Group gap="sm" px="sm">
            <ActionIcon size="sm">
              <IconMoon />
            </ActionIcon>
            <ActionIcon size="sm">
              <IconBell />
            </ActionIcon>
            <ActionIcon
              size="sm"
              onClick={() => {
                pb.authStore.clear();
              }}
            >
              <IconDoorExit />
            </ActionIcon>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Flex
          ref={navLinksRef}
          style={{ flexGrow: 1, borderRadius: "var(--mantine-radius-md)" }}
          bg="brand"
          direction="column"
          px="md"
          py="md"
          justify="space-between"
        >
          <ScrollArea.Autosize type="auto" mah={navScrollMaxHeight}>
            {links.map((link) => (
              <Fragment key={link.id}>
                <Stack>
                  <Flex
                    direction="column"
                    style={{
                      backgroundColor: "var(--mantine-color-brand-5)",
                      borderRadius: "var(--mantine-radius-md)",
                      overflow: "hidden",
                    }}
                  >
                    <NavLink
                      active={linkActived[0] == link.id}
                      label={link.label}
                      leftSection={<link.icon />}
                      childrenOffset="0"
                      opened={
                        !!linksOpened.find(
                          (linkOpened) =>
                            linkOpened == link.id || linkActived[0] == link.id
                        )
                      }
                      onClick={() => {
                        const self = linksOpened.find(
                          (linkOpened) => linkOpened == link.id
                        );

                        if (!self) {
                          setLinksOpened((prev) => [...prev, link.id]);
                        } else {
                          setLinksOpened(
                            linksOpened.filter(
                              (linkOpened) => linkOpened != self
                            )
                          );
                        }
                      }}
                    >
                      {link.childrens.map((linkChildren) => (
                        <Fragment key={linkChildren.id}>
                          <Space h={4} />
                          <NavLink
                            active={
                              linkActived[0] == link.id &&
                              linkActived[1] == linkChildren.id
                            }
                            key={linkChildren.id}
                            label={linkChildren.label}
                            onClick={() => {
                              navigate(linkChildren.url);
                              setLinkActived([link.id, linkChildren.id]);
                            }}
                          />
                        </Fragment>
                      ))}
                      <Space h={4} />
                    </NavLink>
                  </Flex>
                </Stack>
                <Space h="md" />
              </Fragment>
            ))}
          </ScrollArea.Autosize>
          <Flex justify="space-between" align="center" ref={profileRef}>
            <Group gap="xs">
              <Avatar src="/Avatar.jpg" style={{ border: "2px solid white" }} />
              <Flex direction="column">
                <Text size="md" fw={600}>
                  User
                </Text>
                <Text size="xs">Role</Text>
              </Flex>
            </Group>
            <ActionIcon size="sm">
              <IconInfoCircleFilled />
            </ActionIcon>
          </Flex>
        </Flex>
      </AppShell.Navbar>
      <AppShell.Main>
        <ScrollArea
          type="auto"
          p={16}
          style={{
            height:
              "calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))",
          }}
        >
          <Flex
            direction="column"
            style={{
              minWidth: `calc(100vw - 32px - var(--app-shell-aside-width, 0px) - var(--app-shell-navbar-width, 0px))`,
              minHeight: `calc(100vh - 32px - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))`,
            }}
          >
            {children || <Outlet />}
          </Flex>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
