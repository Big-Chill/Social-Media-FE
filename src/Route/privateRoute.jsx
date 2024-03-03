import React from 'react'
import { localStore } from '../services/browserStorage';
import { Route, Redirect } from 'react-router-dom'


export default function Privateroute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (localStore.get('jwtToken')) {
          return <Component {...props} />
        }
        else {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
      }}
    />
  )
}