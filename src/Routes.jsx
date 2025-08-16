import React, { lazy, Suspense } from 'react'
import App from './App';
import Login from './Pages/AuthForm/AuthForm';
import Homepage from './Pages/Homepage/Homepage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import SearchResultPage from './Pages/SearchResultPage/SearchResultPage';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard'
import UserAccountPage from './Admin/Pages/UserAccountPage/UserAccountPage';
 import Logout from "./Pages/Logout"
 import AdminRoute from "./Components/AdminRoute"
 import ProtectedRoute from "./Components/ProtectedRoute"
import MenuUpdate from './Admin/Pages/MenuUpdate/MenuUpdate';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import AuthForm from './Pages/AuthForm/AuthForm';
import BasicSiteSettings from './Admin/Pages/BasicSiteSettings/BasicSiteSettings';
import Dashboard from './Pages/Dashboard/Dashboard';
import Users from './Admin/Pages/Users/Users';
import SeeAndDo from './Pages/SeeAndDo/SeeAndDo';
import BeyondCopenhagen from './Pages/BeyondCopenhagen/BeyondCopenhagen';
import EatAndDrinks from './Pages/EatAndDrinks/EatAndDrinks';
import CityAreas from './Pages/CityAreas/CityAreas';
import Planning from './Pages/Planning/Planning';
import Activities from './Pages/Activities/Activities';
 
const Routes = ({ children }) => {
 
  const getMenuData = async(menuKey) =>{
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/menu?menuKey=${menuKey}`;
        const response = await axios.get(apiUrl);
        return response.data;
  }

  let routes = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: '/login',
          element: <ProtectedRoute><AuthForm /></ProtectedRoute>,
        },
        {
          path: '/logout',
          element: <Logout/>,
        },
         {
          path: '/user',
          element: <UserAccountPage />,
        },
        {
          path: '/see-and-do',
          element: <SeeAndDo />,
        },
        {
          path: '/activities',
          element: <Activities />,
        },
         {
          path: '/beyond-copenhagen',
          element: <BeyondCopenhagen />,
        },
         {
          path: '/eat-and-drink',
          element: <EatAndDrinks />,
        },
        {
          path: '/city-areas',
          element: <CityAreas />,
        },
        {
          path: '/planning',
          element: <Planning />,
        },
        {
          path: '/search',
          element: <SearchResultPage />,
        },
        {
          path: '/admin',
          element: <AdminDashboard />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
              {
              path: 'dashboard',
              element: <Dashboard />,
            },
            {
              path: 'users',
              element: <Users />,
            },
            {
          path: 'basic-site-settings',
          element: <BasicSiteSettings />,
        },
            {
              path: 'main-navigation-top/edit',
              
              element:
        <MenuUpdate menuTitle="Main Navigation Top" />,
              loader: async () => {
                let menuGetResponse = getMenuData("Main Navigation Top");
                return menuGetResponse;
              },
              errorElement: <ErrorPage/>
            },
            {
              path: 'main-navigation-bottom/edit',
              element: <MenuUpdate menuTitle="Main Navigation Bottom" />,
              loader: async () => {
                let menuGetResponse = getMenuData("Main Navigation Bottom");
                return menuGetResponse;
              },
              
              errorElement: <ErrorPage/>
            },
          ]
        }
      ]
    }
  ]);
  return (
    <RouterProvider router={routes}>
      {children}
    </RouterProvider>
  )
}
 
export default Routes
 