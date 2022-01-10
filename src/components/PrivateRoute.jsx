import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import CommonContext from '../context/CommonContext';

export default function PrivateRoute({ path, component: Component }) {

    const { isLoggedIn } = useContext(CommonContext);

    return <Route
        path={path}
        exact
        render={() => {
            return isLoggedIn ? <Component /> : <Redirect to="/login" />
        }}
    />
}
