import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard(){

const navigate = useNavigate();

const handleaddsongs = ()=>{
navigate("/Addsongs");
};

const handleviewsongs = ()=>{
navigate("/Viewsongs");
};

const handleLogout = ()=>{
    navigate("/Adminlogin");

};

return(
    <div className="admin-container">

        <nav className="navigationbar">

            <div className="navigationlogo">
                <img src="/images/logob.png" className="logo"/>
            </div> 

            <h1>Welcome Admin</h1>

            <div className="navbtns">
                <button onClick={handleLogout}>Logout</button>
            </div>

        </nav>

        <div className="admin-content">

            <div className="admin-cards">
                <div className="card">

                    <h3>Songs</h3>
                    <p>Manage songs on platform</p>

                    <div style={{display:"flex", gap:"10px", marginTop:"10px"}}>

                        <button onClick={handleaddsongs}>
                            Add Song
                        </button>

                        <button onClick={handleviewsongs}>
                            View Songs
                        </button>

                    </div>

                </div>

                <div className="card">

                    <h3>Artists</h3>
                    <p>Add new artists to platform</p>

                    <button onClick={()=>navigate("/admin/add-artist")}>
                        Add Artist
                    </button>

                </div>

                <div className="card">

                    <h3>Subscription</h3>
                    <p>Manage subscription plans</p>

                    <button>
                        Manage
                    </button>

                </div>

            </div>

        </div>

    </div>
);
}

export default AdminDashboard;