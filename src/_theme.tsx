import {
  AppShell,
  Button,
  InputLabel,
  Modal,
  NavLink,
  Notification,
  Pagination,
  Table,
  Tabs,
  createTheme,
} from "@mantine/core";

export const theme = createTheme({
  colors: {
    brand: [
      "#D3EFFA",
      "#A9DDF6",
      "#7ABCE6",
      "#48A6DC",
      "#266BAC", // PRIMARY (500)
      "#1A4A77",
      "#133966",
      "#0D2B55",
      "#081E45",
      "#041539",
    ],
  },
  primaryColor: "brand",
  primaryShade: 4,
  fontFamily: "Inter, sans-serif",
  components: {
    AppShell: AppShell.extend({
      defaultProps: {
        bg: "#E5E7EB",
        mih: "100vh",
        mah: "100vh",
        header: {
          height: 80,
          offset: true,
        },
        navbar: {
          width: {
            base: 280,
          },
          breakpoint: "xs",
        },
        styles: {
          main: {
            paddingTop: "var(--app-shell-header-height, 0px)",
            paddingBottom: "var(--app-shell-footer-height, 0px)",
            paddingLeft: "var(--app-shell-navbar-width, 0px)",
            paddingRight: "var(--app-shell-aside-width, 0px)",
          },
        },
      },
    }),
    AppShellHeader: AppShell.Header.extend({
      defaultProps: {
        bg: "brand",
        c: "white",
        px: "md",
        py: "xs",
      },
    }),
    AppShellNavbar: AppShell.Navbar.extend({
      defaultProps: {
        bg: "#E5E7EB",
        withBorder: false,
        py: "md",
        pl: "md",
        c: "white",
      },
    }),
    NavLink: NavLink.extend({
      defaultProps: {
        style: {
          borderRadius: "var(--mantine-radius-md)",
        },
      },
      styles(theme, props) {
        if (props.active) {
          return {
            root: {
              backgroundColor:
                !!props.children || !!props.childrenOffset
                  ? theme.colors.brand[3]
                  : "unset",
              color: "white",
              fontWeight: 700,
            },
          };
        }
        return {
          root: {
            backgroundColor: props.children ? theme.colors.brand[4] : "unset",
          },
        };
      },
    }),
    Button: Button.extend({
      styles(theme, props) {
        if (props.disabled && props.variant === "transparent") {
          return {
            root: {
              backgroundColor: "transparent",
            },
            inner: {
              color: theme.colors.gray[3],
            },
          };
        }

        return {};
      },
    }),
    Table: Table.extend({}),
    TableThead: Table.Thead.extend({
      defaultProps: {
        bg: "gray.1",
      },
    }),
    TableTh: Table.Th.extend({
      defaultProps: {
        c: "gray.5",
        fw: "600",
        style: {
          whiteSpace: "nowrap",
        },
      },
    }),
    TableTd: Table.Td.extend({
      defaultProps: {
        style: {
          whiteSpace: "nowrap",
        },
      },
    }),
    Pagination: Pagination.extend({
      defaultProps: {
        color: "brand",
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: "lg",
        centered: true,
      },
      styles: {
        title: {
          color: "var(--mantine-color-gray-8)",
          fontWeight: "bold",
          fontSize: "var(--mantine-font-size-lg)",
        },
      },
    }),
    TabsList: Tabs.List.extend({
      defaultProps: {
        pos: "sticky",
        top: 0,
        bg: "white",
        style: {
          zIndex: 100,
        },
      },
    }),
    TabsTab: Tabs.Tab.extend({
      defaultProps: {
        fw: 600,
        c: "gray.9",
        px: "xs",
        py: "8px",
      },
    }),
    InputLabel: InputLabel.extend({
      defaultProps: {
        c: "gray.9",
      },
    }),
    Notification: Notification.extend({
      defaultProps: {
        style: {
          boxShadow: "var(--mantine-shadow-xl)",
        },
      },
    }),
  },
});
