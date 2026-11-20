# Our Edinburgh Weekend

Static weekend itinerary for 21–22 November 2026. Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000/`. Serving over HTTP more closely matches GitHub Pages and gives localStorage a stable origin.

## Deploy to GitHub Pages

1. Create a GitHub repository. Upload the **contents** of this folder to the root of the `main` branch, including `css`, `js`, `assets` and `index.html`.
2. In **Settings → Pages**, set **Source** to **Deploy from a branch**. Choose **main** and **/ (root)**, then save. [GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Open the published URL shown in **Settings → Pages** after the deployment finishes.

Check your GitHub Pages access settings before uploading the accommodation address. A standard public Pages site exposes its content to anyone with the URL. Progress, notes and memories stay in the current browser and do not sync between devices. Leave host instructions and booking references outside the site.

## Edit the trip

- `js/data.js` holds the activity times, addresses, map coordinates, venue choices and checklist. Keep activity IDs stable so saved progress remains attached.
- `js/app.js` holds the sunset and flight countdown times and uses the device clock to compare against Edinburgh trip times. Edinburgh is on GMT for these dates.
- `js/map.js` draws the routes. Lines are illustrative connections. Follow the Google Maps links for navigation.
- Maps use Leaflet for the itinerary overlays and MapLibre to render OpenStreetMap data from OpenFreeMap. The basemap requires internet access and WebGL. If it cannot load, the stop markers, route lines and Google Maps links remain available. External links and web fonts also need internet access.

## Credits

- [Edinburgh from Calton Hill](https://commons.wikimedia.org/wiki/File:Edinburgh_and_Dugald_Stewart_Monument_20211020.jpg), Daniel Kraft, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- [Edinburgh on a cold winter evening](https://commons.wikimedia.org/wiki/File:Edinburgh_on_a_cold_winter_evening.JPG), Stablenode, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
- [Sunset behind the Dugald Stewart Monument](https://commons.wikimedia.org/wiki/File:Sunset_behind_The_Dugald_Stewart_Monument_on_Calton_Hill_-_geograph.org.uk_-_7982632.jpg), Iain Lees, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).
- Pictures are cropped in the interface. Leaflet is bundled under its [BSD 2-Clause license](assets/leaflet/LICENSE). Basemap by [OpenFreeMap](https://openfreemap.org/) and [OpenMapTiles](https://openmaptiles.org/). See the bundled [MapLibre licence](assets/maplibre/MAPLIBRE-LICENSE) and [Leaflet bridge licence](assets/maplibre/BRIDGE-LICENSE). Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Icon shapes are adapted from [Lucide](https://lucide.dev/) under its [license](assets/lucide-license.txt).

