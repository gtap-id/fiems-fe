import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { theme } from "./_theme";
import AuthGuard from "./components/auth/AuthGuard";
import RootLayout from "./components/layouts/RootLayout";
import {
  CustomerReportPage,
  CustomerSavePage,
  ErrorPage,
  LoginPage,
  RootPage,
  ShipperGroupReportPage,
  ShipperGroupSavePage,
} from "./pages";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AuthGuard>
                  <RootLayout />
                </AuthGuard>
              }
            >
              <Route index element={<RootPage />} />
              <Route
                path="/master-data/shipper-group"
                element={<ShipperGroupReportPage />}
              />
              <Route
                path="/master-data/shipper-group/save"
                element={<ShipperGroupSavePage />}
              />
              <Route
                path="/master-data/customer"
                element={<CustomerReportPage />}
              />
              <Route
                path="/master-data/customer/save"
                element={<CustomerSavePage />}
              />
            </Route>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  );
}
