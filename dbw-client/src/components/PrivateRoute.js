import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import {useSelector} from 'react-redux';



export const PrivateRoute = ({ component:Component, ...rest}) => {
    const user = useSelector((state) => state.userReducer);
    <Route {...rest} component={(props) => (
        user.isLoggedIn ? (
            <Component {...props} />
        ):(
            <Navigate to="/signin" />
        )
    )} />
}

export default PrivateRoute;