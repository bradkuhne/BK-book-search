import { gql } from '@apollo/client';
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
// change to Save book
export const SAVE_BOOK = gql`
  mutation saveBook($id: String!, $authors: [String], $description: String, $title: String, $image: String, $link: String) 
  {
    saveBook(bookId: $id, authors: $authors, description: $description, title: $title, image: $image, link: $link )
     {
        _id
        username
        email
        bookCount
        savedBooks
        {
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
// change to Remove book
export const REMOVE_BOOK = gql`
  mutation removeBook($id: String!)
    {
    removeBook(bookId: $id)
     {
        _id
        username
        email
        bookCount
        savedBooks
        {
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