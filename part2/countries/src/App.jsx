import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => setFilter(event.target.value)

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    if (countriesToShow.length === 1) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countriesToShow[0].name.common}`)
        .then(response => {
          setDetails(response.data)
        })
    } else {
      setDetails(null)
    }
  }, [countriesToShow])

  let content = null
  if (countriesToShow.length > 10) {
    content = <h3>Too many matches.</h3>
  } else if (countriesToShow.length > 1) {
    content = (
      <ul>
        {countriesToShow.map(country =>
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => setFilter(country.name.common)}>Show</button>
          </li>
        )}
      </ul>
    )
  } else if (countriesToShow.length === 1 && details) {
    content = (
      <div>
        <h2>{details.name.common}</h2>
        <h4>Capital: {details.capital}</h4>
        <h4>Area: {details.area}</h4>
        <h3>Languages</h3>
        <ul>
          {Object.values(details.languages).map(language =>
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={details.flags.png} alt={`Flag of ${details.name.common}`} width="100" />
      </div>
    )
  }

  return (
    <div>
      <p>
        find countries: <input value={filter} onChange={handleFilterChange}/>
      </p>
      {content}
    </div>
  )
}

export default App
