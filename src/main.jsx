import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.css"
// import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js"
import Routes from './Routes.jsx'
createRoot(document.getElementById('root')).render(
  <Routes>
    <App />
  </Routes>
    ,
)
