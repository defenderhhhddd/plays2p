import { Route, Switch, useLocation } from "wouter";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import MyCards from "@/pages/MyCards";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import FAQ from "@/pages/FAQ";
import Profile from "@/pages/Profile";
import ApiKeys from "@/pages/ApiKeys";
import Security from "@/pages/Security";
import AuditLogs from "@/pages/AuditLogs";
import Reports from "@/pages/Reports";
import Exchange from "@/pages/Exchange";
import Wallet from "@/pages/Wallet";
import Disputes from "@/pages/Disputes";
import Notifications from "@/pages/Notifications";
import Terminals from "@/pages/Terminals";
import Devices from "@/pages/Devices";
import DownloadApk from "@/pages/DownloadApk";
import PaymentMethods from "@/pages/PaymentMethods";
import Counterparties from "@/pages/Counterparties";
import MerchantLogin from "@/pages/merchant/MerchantLogin";
import MerchantDashboard from "@/pages/merchant/MerchantDashboard";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const token = localStorage.getItem("traderToken");
  if (!token) return <Login />;
  return <Component />;
}

function MerchantRoute({ component: Component }: { component: React.ComponentType }) {
  const token = localStorage.getItem("merchantToken");
  if (!token) return <MerchantLogin />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <AdminLogin />;
  return <Component />;
}

export default function App() {
  const [location] = useLocation();

  const isAdminRoute = location.startsWith("/admin");
  const isMerchantRoute = location.startsWith("/merchant");

  if (!isAdminRoute && !isMerchantRoute && !localStorage.getItem("traderToken") && location !== "/") {
    return <Login />;
  }

  return (
    <div className="bg-black min-h-screen">
      <Switch>
        {/* Общие */}
        <Route path="/" component={Login} />
        
        {/* Трейдерские */}
        <Route path="/dashboard"   component={() => <PrivateRoute component={Dashboard} />} />
        <Route path="/orders"      component={() => <PrivateRoute component={Orders} />} />
        <Route path="/cards"       component={() => <PrivateRoute component={MyCards} />} />
        <Route path="/settings"    component={() => <PrivateRoute component={Settings} />} />
        <Route path="/support"     component={() => <PrivateRoute component={Support} />} />
        <Route path="/faq"         component={() => <PrivateRoute component={FAQ} />} />
        <Route path="/profile"     component={() => <PrivateRoute component={Profile} />} />
        <Route path="/api-keys"    component={() => <PrivateRoute component={ApiKeys} />} />
        <Route path="/security"    component={() => <PrivateRoute component={Security} />} />
        <Route path="/logs"        component={() => <PrivateRoute component={AuditLogs} />} />
        <Route path="/reports"     component={() => <PrivateRoute component={Reports} />} />
        <Route path="/exchange"    component={() => <PrivateRoute component={Exchange} />} />
        <Route path="/wallet"      component={() => <PrivateRoute component={Wallet} />} />
        <Route path="/disputes"    component={() => <PrivateRoute component={Disputes} />} />
        <Route path="/notifications" component={() => <PrivateRoute component={Notifications} />} />
        <Route path="/terminals"   component={() => <PrivateRoute component={Terminals} />} />
        <Route path="/devices"     component={() => <PrivateRoute component={Devices} />} />
        <Route path="/download-apk" component={() => <PrivateRoute component={DownloadApk} />} />
        <Route path="/payment-methods" component={() => <PrivateRoute component={PaymentMethods} />} />
        <Route path="/counterparties" component={() => <PrivateRoute component={Counterparties} />} />
        
        {/* Мерчантские */}
        <Route path="/merchant/login"      component={MerchantLogin} />
        <Route path="/merchant/dashboard"  component={() => <MerchantRoute component={MerchantDashboard} />} />
        
        {/* Админские */}
        <Route path="/admin"           component={AdminLogin} />
        <Route path="/admin/dashboard" component={() => <AdminRoute component={AdminDashboard} />} />
      </Switch>
    </div>
  );
}
