<script lang="ts">
  import type { Map as LeafletMap } from 'leaflet';
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import type { SchoolLocation } from '../../data/site';

  export let locations: SchoolLocation[] = [];
  export let schoolName: string;

  let mapCanvas: HTMLDivElement;
  let loadError = false;

  const getDirectionsHref = ({ latitude, longitude }: SchoolLocation) =>
    `https://www.google.com/maps/dir/?api=1&destination=${latitude}%2C${longitude}&travelmode=driving`;

  onMount(() => {
    let map: LeafletMap | undefined;
    let disposed = false;

    async function initialiseMap() {
      try {
        const L = await import('leaflet');
        if (disposed) return;

        const mapInstance = L.map(mapCanvas, {
          scrollWheelZoom: false,
          zoomControl: false
        });
        map = mapInstance;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapInstance);

        const markerIcon = L.divIcon({
          className: 'kc-map-marker',
          html: '<span class="kc-map-marker__pin" aria-hidden="true"><span>K</span></span>',
          iconAnchor: [30, 68],
          iconSize: [60, 70],
          popupAnchor: [0, -62]
        });

        const bounds = L.latLngBounds([]);

        locations.forEach((location) => {
          const popup = document.createElement('div');
          popup.className = 'kc-map-popup';

          const name = document.createElement('strong');
          name.textContent = schoolName;

          const schoolAddress = document.createElement('span');
          schoolAddress.textContent = location.address;

          const directions = document.createElement('a');
          directions.href = getDirectionsHref(location);
          directions.target = '_blank';
          directions.rel = 'noreferrer';
          directions.textContent = 'Get directions';

          popup.append(name, schoolAddress, directions);

          const marker = L.marker([location.latitude, location.longitude], {
            icon: markerIcon,
            keyboard: true,
            title: `${schoolName}, ${location.address}`
          })
            .addTo(mapInstance)
            .bindPopup(popup);

          marker.getElement()?.setAttribute('aria-label', `${schoolName}, ${location.address}`);
          bounds.extend([location.latitude, location.longitude]);
        });

        if (locations.length === 1) {
          mapInstance.setView([locations[0].latitude, locations[0].longitude], 16);
        } else if (locations.length > 1) {
          mapInstance.fitBounds(bounds, { maxZoom: 14, padding: [72, 72] });
        }

        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
        requestAnimationFrame(() => mapInstance.invalidateSize());
      } catch {
        loadError = true;
      }
    }

    void initialiseMap();

    return () => {
      disposed = true;
      map?.remove();
    };
  });
</script>

<div class="school-map" aria-label={`Interactive map showing ${schoolName}`}>
  <div class="school-map__canvas" bind:this={mapCanvas}></div>

  {#if loadError}
    <p class="school-map__error">The interactive map could not load. Please use the contact details above.</p>
  {/if}
</div>

<style>
  .school-map {
    position: relative;
    width: 100%;
    height: clamp(440px, 68svh, 760px);
    overflow: hidden;
    background: #eef0ed;
  }

  .school-map__canvas {
    width: 100%;
    height: 100%;
  }

  .school-map__error {
    position: absolute;
    z-index: 450;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    margin: 0;
    padding: 0.8rem 1rem;
    color: var(--kc-ink);
    background: rgb(255 255 255 / 94%);
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.45;
  }

  :global(.school-map .leaflet-tile-pane) {
    filter: grayscale(0.72) saturate(0.62) contrast(0.92) brightness(1.04);
  }

  :global(.school-map .leaflet-control-zoom) {
    border: 0;
    border-radius: 2px;
    box-shadow: 0 8px 28px rgb(9 24 56 / 14%);
  }

  :global(.school-map .leaflet-control-zoom a) {
    border-color: color-mix(in srgb, var(--kc-navy) 16%, white);
    color: var(--kc-navy);
    background: rgb(255 255 255 / 94%);
    font-family: var(--font-body);
  }

  :global(.kc-map-marker) {
    border: 0;
    background: transparent;
  }

  :global(.kc-map-marker__pin) {
    position: relative;
    display: grid;
    width: 56px;
    height: 56px;
    place-items: center;
    border: 3px solid var(--kc-white);
    border-radius: 50% 50% 50% 0;
    color: var(--kc-navy);
    background: var(--kc-navy);
    box-shadow: 0 10px 24px rgb(9 24 56 / 28%);
    transform: rotate(-45deg);
  }

  :global(.kc-map-marker__pin > span) {
    position: relative;
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 50%;
    background: var(--kc-white);
    box-shadow: 0 0 0 3px var(--kc-sky);
    font-family: var(--font-body);
    font-size: 1.35rem;
    font-weight: 850;
    line-height: 1;
    transform: rotate(45deg);
  }

  :global(.kc-map-marker__pin > span::after) {
    position: absolute;
    top: 0.28rem;
    right: 0.24rem;
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 50%;
    background: var(--kc-magenta);
    content: '';
  }

  :global(.school-map .leaflet-popup-content-wrapper),
  :global(.school-map .leaflet-popup-tip) {
    border-radius: 2px;
    color: var(--kc-ink);
    background: var(--kc-white);
    box-shadow: 0 12px 32px rgb(9 24 56 / 18%);
  }

  :global(.school-map .leaflet-popup-content) {
    min-width: 190px;
    margin: 1rem 1.1rem;
    font-family: var(--font-body);
    line-height: 1.4;
  }

  :global(.kc-map-popup) {
    display: grid;
    gap: 0.35rem;
  }

  :global(.school-map .leaflet-popup-content strong) {
    color: var(--kc-navy);
    font-size: 1rem;
  }

  :global(.school-map .leaflet-popup-content span) {
    color: var(--kc-muted);
    font-size: 0.82rem;
  }

  :global(.school-map .leaflet-popup-content a) {
    width: fit-content;
    margin-top: 0.2rem;
    color: var(--kc-navy);
    font-size: 0.82rem;
    font-weight: 760;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }

  @media (max-width: 560px) {
    .school-map {
      height: 62svh;
      min-height: 430px;
    }

  }
</style>
