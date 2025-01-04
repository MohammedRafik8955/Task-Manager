import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AdminForm from "./scenes/AdminLogin";
import EditForm from "./scenes/team/EditForm";
import AddCatagory from "./scenes/addCategory/AddCatagory";
import SubCatogary from "./scenes/addCategory/SubCatogary";
import Category from "./scenes/showCatogery/Category";
import SubCategory from "./scenes/showCatogery/SubCategory";
import AddClient from "./scenes/addClient/AddClient";
import ShowClient from "./scenes/addClient/ShowClient";
import AddTask from "./scenes/addTask/AddTask";
import TaskList from "./scenes/addTask";
import Update from "./scenes/addTask/Update";
import DashboardCard from "./scenes/dashboard";
import CreateRefrence from "./scenes/refrence/CreateRefrence";
import ShoeRef from "./scenes/refrence/Index";
import ShowDetails from "./scenes/addClient/showDetails";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();

  // Correctly retrieve the token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token && window.location.pathname !== "/") {
      navigate("/"); // Navigate to login if no token
    }
  }, [token, navigate]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Only show Sidebar and Topbar if token exists and route is not AdminForm */}
          {token && window.location.pathname !== "/" && (
            <>
            
              <Sidebar isSidebar={isSidebar} />
              <Topbar setIsSidebar={setIsSidebar} />
            </>
          )}
          <main className="content">
            <Routes>
              {/* Redirect to AdminForm if not logged in */}
              {/* <Route path="/" element={token ? <Dashboard /> : <AdminForm />} /> */}
              <Route path="/" element={<AdminForm />} />
              {token && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/editForm" element={<EditForm />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/catogery" element={<Category />} />
                  <Route path="/showsubcatogery" element={<SubCategory />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/addCategory" element={<AddCatagory />} />
                  <Route path="/subCategory" element={<SubCatogary />} />
                  <Route path="/addClient" element={<AddClient />} />
                  <Route path="/editClient/:id" element={<AddClient />} />
                  <Route path="/showClientDetails/:id" element={<ShowDetails />} />
                  <Route path="/showClient" element={<ShowClient />} />
                  <Route path="/addtask" element={<AddTask />} />
                  <Route path="/editTask/:id" element={<Update />} />
                  <Route path="/taskList" element={<TaskList />} />
                  <Route path="/addRefrence" element={<CreateRefrence />} />
                  <Route path="/addRefrence/:id" element={<CreateRefrence />} />
                  <Route path="/showRef" element={<ShoeRef />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
