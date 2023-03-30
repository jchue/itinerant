import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LocationSearch({ addClass, initialValue = '', onSelect }) {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (focused) {
      // Clear any previous selection
      onSelect(null);
      setLoading(true);

      // Require 1 second idle before retrieving suggestions
      const delayDebounceFn = setTimeout(() => {
        if (query) {
          suggest(query);
          setLoading(false);
        } else {
          setSuggestions([]);
          setLoading(false);
        }
      }, 1000)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [query]);

  async function suggest(term) {
    const suggestions = (await axios(`https://photon.komoot.io/api/?q=${term}&layer=city`)).data.features;
    setSuggestions(suggestions);
  }

  // Need delay in order for selection to register
  function loseFocus() {
    setTimeout(() => {
      setFocused(false);
    }, 200);
  }

  // Generate hierarchy string (i.e., "City, State, Country")
  function generateGeoHierarchy(location) {
    const cityString = location.properties.name;
    const stateString = location.properties.state ? `, ${location.properties.state}` : '';
    const countryString = `, ${location.properties.country}`;
  
    return cityString + stateString + countryString;
  }

  // Upon selection, update field value and emit selection
  function select(selected) {
    setQuery(generateGeoHierarchy(selected));
    onSelect(selected);
  }

  return (
    <div className="relative">
      <input
        value={query}
        onInput={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={loseFocus}
        type="text"
        className={`bg-gray-200 border-2 outline-none p-2 rounded-md
        text-gray-700 text-sm focus:border-emerald-400 ${addClass}`}
      />

      {focused &&
        <ul
          className="absolute z-10 mt-1 bg-white shadow-lg max-h-56 rounded-md py-1 text-base
          ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {loading &&
            <li
              className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm">
              Loading...
            </li>
          }

          {suggestions.map((suggestion) => (
            <li
              key={suggestion.properties.osm_id}
              onClick={() => select(suggestion)}
              className="text-gray-900 cursor-pointer select-none relative
              py-2 pl-3 pr-9 text-sm hover:bg-gray-100"
            >
              <span className="block">{generateGeoHierarchy(suggestion)}</span>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
