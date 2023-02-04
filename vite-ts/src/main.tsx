import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.NODE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL : "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <h1 id="helloworld">Hello World!</h1>
    <App />
  </ApolloProvider>
)
