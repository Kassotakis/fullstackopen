import { useState } from "react";
import { useQuery, gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

export const BOOKS_IN_GENRE = gql`
  query booksInGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { loading: allLoading, data: allData } = useQuery(ALL_BOOKS);
  const { data: genreData, loading: genreLoading } = useQuery(BOOKS_IN_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  });

  if (!props.show) return null;

  if (allLoading || (selectedGenre && genreLoading))
    return <div>Loading...</div>;

  const allBooks = allData.allBooks;
  const booksToShow = selectedGenre
    ? genreData?.allBooks || allBooks
    : allBooks;

  const genreSet = new Set();
  allBooks.forEach((book) => {
    book.genres.forEach((g) => genreSet.add(g));
  });
  const genres = Array.from(genreSet);

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
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

      <div style={{ marginTop: "1em" }}>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
