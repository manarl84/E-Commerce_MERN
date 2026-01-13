

import {Outlet} from 'react-router';
import { useAuth } from '../context/Auth/AuthContext';
import { Navigate } from 'react-router';

const ProtectedRoute = () => {

    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;