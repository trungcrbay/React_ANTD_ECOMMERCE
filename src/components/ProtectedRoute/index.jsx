import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBaseRoute = (props) => {
    //check xem co vao trang admin hay ko
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.role; //lay ra role cua nguoi dung

    if (isAdminRoute && userRole === 'ADMIN'
    || !isAdminRoute && (userRole === 'USER' || userRole === 'ADMIN')) {
        return (<>{props.children}</>)
    } else {
        return (<></>)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    return (
        <div>
            {isAuthenticated === true ?
                <RoleBaseRoute>
                    {props.children}
                </RoleBaseRoute>
                : <Navigate to='/login' />}

        </div>
    )
}

export default ProtectedRoute;