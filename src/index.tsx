import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from './context/user/state';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const token = localStorage.getItem('token');
export const client = new ApolloClient({
  // uri: `${process.env.REACT_APP_CLIENT_HOST}graphql`,
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: token ? `${token}` : '',
  },
});

root.render(
  // <React.StrictMode>
  <Router>
    <ApolloProvider client={client}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>
  </Router>
  // </React.StrictMode>
);
