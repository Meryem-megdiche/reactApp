import React, { useEffect } from 'react'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useAuth } from './authContexte/AuthContext';
import Topbar from './scenes/global/Topbar';
import Dashboard from './scenes/dashbord';
import Sidebar from './scenes/global/Sidebar';
import Team from "./scenes/ListeEquip";
import Contacts from "./scenes/FormEquip";
import Invoices from "./scenes/formConfig";
import Form from "./scenes/formUser";
import Calendar from "./scenes/calendar";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import Ping from "./scenes/ping";
import ModifyUser from "./scenes/ModifyUser";
import Intervention from "./scenes/intervention";
import Listes from "./scenes/listeIntervention";
import Config from "./scenes/listeConfig";
import Topologi from "./scenes/Topologie";
import InterventionDetails from "./scenes/InterventionDetails";
import { SnackbarProvider } from 'notistack';
import Alert from "./scenes/alert";
import LoginForm from './scenes/LoginForm/LoginForm';
import User from "./scenes/ListeUser";
import ResetPasswordForm from "./scenes/forgot";
import ForgotPasswordForm from "./scenes/password";
import TTLStatsPieChart from "./components/Pie";
import Inventory from "./scenes/inventory";
import InventoryList from './scenes/count';
import ModifyEquipment from './scenes/ModifyEquipment'
import ModifyConfig from './scenes/ModifyConfig'
function App() {
  const [theme, colorMode] = useMode();
  const { currentUser } = useAuth();
  const location = useLocation(); 
  const isLoginPage = location.pathname === '/';
  const isForgotPasswordPage = location.pathname === '/forgot' || location.pathname === '/password';

  useEffect(() => {
    console.log("Current user role:", currentUser?.role);
  }, [currentUser]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <div className="app">
            {!isLoginPage && !isForgotPasswordPage && <Sidebar />}
            <main className={isForgotPasswordPage ? "content-full" : "content"}>
              {!isLoginPage && !isForgotPasswordPage && <Topbar />}
              <Routes>
                <Route path="/" element={<LoginForm />} />
                {currentUser ? (
                  <>
                    {currentUser.role === 'technicienReseau' && (
                      <>
                        <Route path="/forgot" element={<ResetPasswordForm />} />
                    <Route path="/" element={ <LoginForm/>} />
            <Route path ="/dashboard" element ={<Dashboard/>}/>
                <Route path ="/team" element ={<Team/>}/>
              
              
               
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/ping" element={<Ping />} />
                <Route path="/ping/:equipmentId" element={<Ping />} />
              
                <Route path="/config" element={<Config/>} />
             
                <Route path="/intervention" element={<Intervention />} />
                <Route path="/liste" element={<Listes />} />
              
                <Route path="/pie" element={<TTLStatsPieChart />} />
                <Route path="/listes/:id" element={<InterventionDetails />} />
                <Route path="/equip/:id" element={<Listes />} />
                <Route path="/alert/:equipmentId" element={<Alert />} />
                <Route path="/Topologie" element={<Topologi />} />
                
                <Route path="/alert"element={<Alert/>}/>
                <Route path="/pie/:equipmentId" element={<Pie />} />
               
                <Route path="/forgot" element={ <ResetPasswordForm/>} />
                <Route path="/password" element={ <ForgotPasswordForm/>} />
                <Route path="/inventory" element={<Inventory />} />
                        <Route path="/scanned-count" element={<InventoryList />} />
                        <Route path="*" element={<Navigate replace to="/dashboard" />} />
                      </>
                    )}
                    {currentUser.role === 'admin' && (
                      <>
                    <Route path="/forgot" element={<ResetPasswordForm />} />
                    <Route path="/" element={ <LoginForm/>} />
            <Route path ="/dashboard" element ={<Dashboard/>}/>
                <Route path ="/team" element ={<Team/>}/>
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/ping" element={<Ping />} />
                <Route path="/ping/:equipmentId" element={<Ping />} />
                <Route path="/modify/:id" element={<ModifyEquipment />} />
                <Route path="/modify-config/:id" element={<ModifyConfig />} />
                <Route path="//modify-user/:id" element={<ModifyUser />} />
                <Route path="/intervention" element={<Intervention />} />
                <Route path="/liste" element={<Listes />} />
                <Route path="/listes" element={<Listes />} />
                <Route path="/pie" element={<TTLStatsPieChart />} />
                <Route path="/listes/:id" element={<InterventionDetails />} />
                <Route path="/equip/:id" element={<Listes />} />
                <Route path="/alert/:equipmentId" element={<Alert />} />
                <Route path="/invoices/:equipmentId" element={<Invoices/>} />
                <Route path="/config" element={<Config/>} />
                <Route path="/alert"element={<Alert/>}/>
                <Route path="/pie/:equipmentId" element={<Pie />} />
                <Route path="/Topologie" element={<Topologi />} />
                <Route path="/user" element={<User/>} />
                <Route path="/forgot" element={ <ResetPasswordForm/>} />
                <Route path="/password" element={ <ForgotPasswordForm/>} />
                <Route path="/inventory" element={<Inventory />} />
                        <Route path="/scanned-count" element={<InventoryList />} />
                        <Route path="*" element={<Navigate replace to="/dashboard" />} />
                      </>
                    )}
                    {currentUser.role === 'adminSystem' && (
                      <>
                        <Route path="/forgot" element={<ResetPasswordForm />} />
                        <Route path="/password" element={<ForgotPasswordForm />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/form" element={<Form />} />
                        <Route path="/modify-user/:id" element={<ModifyUser />} />
                        <Route path="/calendar" element={< Calendar/>} />
                        <Route path="*" element={<Navigate replace to="/user" />} />
                      </>
                    )}
                  </>
                ) : (
                  <Route path="*" element={<Navigate replace to="/" />} />
                )}
              </Routes>
            </main>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
