/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import './App.css';

import axios from 'axios';

function App() {
  const didMountRef = useRef(false);
  const [state, setState] = useState({
    countries: [],
    sort: 0
  });

  useEffect(() => {
    if (didMountRef.current) {
    } else {
      const countryData = [];
      axios
        .get('https://restcountries.com/v3.1/all?fields=capital,name')
        .then((response) => {
          response.data.map((capitalData, i) => {
            if (capitalData.capital[0]) {
              const obj = {};
              obj.country = capitalData.name.common;
              obj.capital = capitalData.capital[0];
              countryData.push(obj);
            }
          });
          axios
            .get('https://restcountries.com/v3.1/all?fields=capital,population')
            .then((response2) => {
              response2.data.map((capitalData, i) => {
                if (capitalData.capital[0]) {
                  countryData.map((obj, i) => {
                    if (obj.capital === capitalData.capital[0]) {
                      countryData[i].population = capitalData.population;
                    }
                  });
                }
              });
              setState((prevState) => ({
                ...prevState,
                countries: countryData
              }));
            });
        });
      didMountRef.current = true;
    }
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    const data = state.countries;
    if (e.target.value === '1') {
      const data2 = data.sort(function (a, b) {
        return a.population - b.population;
      });
      setState((prevState) => ({
        ...prevState,
        countries: data2
      }));
    } else if (e.target.value === '2') {
      const data2 = data.sort(function (a, b) {
        return b.population - a.population;
      });
      setState((prevState) => ({
        ...prevState,
        countries: data2
      }));
    }
  };

  return (
    <div>
      <select onChange={handleChange}>
        <option value="0">No sort</option>
        <option value="1">Assending</option>
        <option value="2">Desending</option>
      </select>
      {state.countries.map((country, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>{country.country}</p>
          <p style={{ marginBottom: '0.5rem' }}>{country.population}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
