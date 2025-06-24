import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import { BOOK_ADDED } from "./queries";

import { useApolloClient } from "@apollo/client";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const savedToken = localStorage.getItem("phonenumbers-user-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded;
      window.alert(`New book added: ${book.title} by ${book.author.name}`);
      updateCacheWith(book, client);
    },
  });

  const updateCacheWith = (book, client) => {
    const includedIn = (set, object) =>
      set.map((b) => b.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, book)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: [...dataInStore.allBooks, book],
        },
      });
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

        <Authors show={page === "authors"} />

        <Books show={page === "books"} />

        <LoginForm setToken={setToken} show={page === "login"} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>Create Book</button>
        <button onClick={() => setPage("recommended")}>Recommended</button>

        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommended show={page === "recommended"} />
    </div>
  );
};

export default App;
