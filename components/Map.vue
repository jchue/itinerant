<script lang="ts" setup>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const config = useRuntimeConfig();
const props = defineProps(['geojson']);
const map = ref(null);
const mapContainer = ref(null);

function createMap() {
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: config.mapStyle,
  });

  map.value.on('load', () => {
    map.value.addSource('places', {
      type: 'geojson',
      data: props.geojson,
    });

    // Add a layer showing the places
    map.value.addLayer({
      id: 'places',
      type: 'symbol',
      source: 'places',
      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
      },
    });

    // Center map to include all features
    const coordinates = props.geojson.features.map((feature) => feature.geometry.coordinates);

    map.value.fitBounds(coordinates, {
      padding: 32,
    });

    /**
     * When a click event occurs on a feature in the places layer,
     * open a popup at the location of the feature
     * with description HTML from its properties.
     */
    map.value.on('click', 'places', (e) => {
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
        .addTo(map.value);
    });

    // Change cursor to pointer on places layer mouseover
    map.value.on('mouseenter', 'places', () => {
      map.value.getCanvas().style.cursor = 'pointer';
    });

    // Change back to pointer on exit
    map.value.on('mouseleave', 'places', () => {
      map.value.getCanvas().style.cursor = '';
    });
  });
}

onMounted(() => {
  createMap();
});
</script>

<template>
  <div ref="mapContainer" class="h-full w-full"></div>
</template>

<style>
.maplibregl-popup {
  max-width: 12rem;
}

.maplibregl-popup-close-button {
  padding: 0.2rem 0.5rem;
}

.maplibregl-popup-content {
  text-align: center;
}
</style>
