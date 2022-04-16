import { gql } from '@apollo/client';

// changed QUERY_ME to GET_ME
export const GET_ME = gql` 
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;