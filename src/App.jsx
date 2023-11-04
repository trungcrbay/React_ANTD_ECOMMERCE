import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from './pages/books';
import ContactPage from './pages/contact';
import LoginPage from './pages/login';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlide';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import ViewOrder from './components/Order/ViewOrder';
import Payment from './components/Order/Payment';
import PaymentSuccess from './components/Order/PaymentSuccess';
import BookTable from './components/Admin/Book/BookTable';
import PaymentHistory from './components/Order/PaymentHistory';
import OrderTable from './components/Admin/Order/OrderTable';


const Layout = () => {
  const [searchTerm,setSearchTerm] = useState("");
  return (
    <div className='layout-app' style={{background:'#fff'}}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <Outlet context={[searchTerm,setSearchTerm]}/>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
    return; //khong goi api 

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug", //:slug:search params create unique books(can be abc,xyz,...)
          element: <BookPage />,
        },
        {
          path: "order",
          element: <Outlet />, // Use Outlet here to render child routes
          children: [
            {
              index: true, // Use index to display content for /order
              element: <ViewOrder />,
            },
            {
              path: "payment",
              element: <Payment />,
            },
            {
              path:'success',
              element:<PaymentSuccess/>
            },
            {
              path: "history",
              element: <PaymentHistory />,
            }

          ],
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
        {
          path: "order",
          element: <OrderTable />,    
        },
        
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {
        isLoading === false
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/'
          ?
          <RouterProvider router={router} /> //dang nhap thanh cong => render ra RouterProvider chua cac router
          :
          <Loading />
      }
    </>
  )
}
