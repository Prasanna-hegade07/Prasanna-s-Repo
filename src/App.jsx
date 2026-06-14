import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Adminlogin from "./pages/Adminlogin";
import AdminDashboard from "./pages/AdminDashboard";
import Addsongs from "./pages/Addsongs";
import Viewsongs from "./pages/Viewsongs";
import Editsong from "./pages/Editsong";
import ArtistProfile from "./pages/ArtistProfile";
import AddArtist from "./pages/AddArtist";
import ViewArtist from "./pages/ViewArtist";
import ViewUsers from "./pages/ViewUsers";
import ManageSubscription from "./pages/ManageSubscription";
import Subscription from "./pages/Subscription";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/"                          element={<Home />} />
      <Route path="/Home"                      element={<Home />} />
      <Route path="/Login"                     element={<Login />} />
      <Route path="/Registration"              element={<Registration />} />
      <Route path="/Adminlogin"                element={<Adminlogin />} />
      <Route path="/AdminDashboard"            element={<AdminDashboard />} />
      <Route path="/Addsongs"                  element={<Addsongs />} />
      <Route path="/Viewsongs"                 element={<Viewsongs />} />
      <Route path="/edit-song/:id"             element={<Editsong />} />
      <Route path="/artist/:id"               element={<ArtistProfile />} />
      <Route path="/admin/add-artist"          element={<AddArtist />} />
      <Route path="/admin/view-artists"        element={<ViewArtist />} />
      <Route path="/admin/users"               element={<ViewUsers />} />
      <Route path="/admin/subscriptions"       element={<ManageSubscription />} />
      <Route path="/Subscription"              element={<Subscription />} />
      <Route path="/UserProfile"               element={<UserProfile />} />
    </Routes>
  );
}

export default App;