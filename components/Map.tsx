import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function Map({ geojson }) {
  const map = useRef(null);
  const mapContainer = useRef(null);

  function createMap() {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAP_STYLE,
    });
  
    map.current.on('load', () => {
      if (!map.current.getSource('places')) {
        map.current.addSource('places', {
          type: 'geojson',
          data: geojson,
        });
      }
  
      // Add a layer showing the places
      map.current.addLayer({
        id: 'places',
        type: 'symbol',
        source: 'places',
        layout: {
          'icon-image': '{icon}',
          'icon-allow-overlap': true,
        },
      });
  
      if (geojson.features.length) {
      // Center map to include all features
        const coordinates = geojson.features.map((feature) => feature.geometry.coordinates);
    
        map.current.fitBounds(coordinates, {
          padding: 32,
        });
    
        /**
         * When a click event occurs on a feature in the places layer,
         * open a popup at the location of the feature
         * with description HTML from its properties.
         */
        map.current.on('click', 'places', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { title, description } = e.features[0].properties;
    
          /**
           * Ensure that if the map is zoomed out
           * such that multiple copies of the feature are visible,
           * the popup appears over the copy being pointed to.
           */
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
    
          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<span class="block font-bold">${title}</span><span class="bold">${description}</span>`)
            .addTo(map.current);
        });
      }

      // Change cursor to pointer on places layer mouseover
      map.current.on('mouseenter', 'places', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
  
      // Change back to pointer on exit
      map.current.on('mouseleave', 'places', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });
  }

  useEffect(() => {
    createMap();
  }, []);

  return (
    <div ref={mapContainer} className="h-full w-full"></div>
  );
}
