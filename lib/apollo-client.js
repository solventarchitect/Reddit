import { InMemoryCache, ApolloClient } from '@apollo/client';

const client = new ApolloClient({
  uri: "https://northcanton.stepzen.net/api/reddit/__graphql",
  headers: {
    "Authorization": `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_API_KEY}`,
    "Content-Type": "application/json"
  },
  cache: new InMemoryCache()
})

export default client