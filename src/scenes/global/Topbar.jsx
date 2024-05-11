import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();  // Ajout pour utiliser la navigation
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    navigate('/'); // Redirige l'utilisateur vers la page de connexion
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >

        
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />  {/* Attach the logout handler here */}
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
