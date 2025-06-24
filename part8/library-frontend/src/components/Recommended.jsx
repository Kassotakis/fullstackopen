import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { BOOKS_IN_GENRE } from "./Books";
import { ALL_BOOKS } from "./Books";

export const ME = gql`
  query {
    me {
      favouriteGenre
    }
  }
`;

const SET_FAVOURITE_GENRE = gql`
  mutation SetFavouriteGenre($genre: String!) {
    setFavouriteGenre(genre: $genre) {
      favouriteGenre
    }
  }
`;

const Recommended = (props) => {
  const [favouriteGenre, setFavouriteGenre] = useState(null);

  const { loading: userLoading, data: userData } = useQuery(ME);

  const { loading: allLoading, data: allData } = useQuery(ALL_BOOKS);
  const { data: genreData, loading: genreLoading } = useQuery(BOOKS_IN_GENRE, {
    variables: { genre: favouriteGenre },
    skip: !favouriteGenre,
  });
  const [setGenreOnServer] = useMutation(SET_FAVOURITE_GENRE, {
    refetchQueries: [{ query: ME }],
  });

  useEffect(() => {
    if (userData?.me?.favouriteGenre) {
      setFavouriteGenre(userData.me.favouriteGenre);
    }
  }, [userData]);

  if (!props.show) return null;

  if (allLoading || (favouriteGenre && genreLoading))
    return <div>Loading...</div>;

  const allBooks = allData.allBooks;

  const booksToShow = favouriteGenre
    ? genreData?.allBooks || allBooks
    : allBooks;

  const genreSet = new Set();
  allBooks.forEach((book) => {
    book.genres.forEach((g) => genreSet.add(g));
  });
  const genres = Array.from(genreSet);

  return (
    <div>
      <h2>recommended books</h2>
      <p>What's your favourite genre?</p>
      <select
        value={favouriteGenre || ""}
        onChange={async ({ target }) => {
          const genre = target.value;
          setFavouriteGenre(genre);
          if (genre) {
            try {
              await setGenreOnServer({ variables: { genre } });
            } catch (error) {
              console.error("Failed to save favourite genre", error);
            }
          }
        }}
      >
        <option value="">Select genre</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      {favouriteGenre && (
        <p>
          in genre <strong>{favouriteGenre}</strong>
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {booksToShow.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
