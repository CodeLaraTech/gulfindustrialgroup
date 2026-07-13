document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('gig-leaflet-map');
    if (mapContainer && typeof L !== 'undefined') {
        const mapCenter = [25.00, 55.00];
        const map = L.map('gig-leaflet-map', {
            center: mapCenter,
            zoom: 8.5,
            zoomControl: true,
            scrollWheelZoom: false
        });

        // Add CartoDB Positron light style tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom marker icons
        const hqIcon = L.divIcon({
            className: 'gig-marker-hq',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -7]
        });

        const hubIcon = L.divIcon({
            className: 'gig-marker-hub',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -7]
        });

        // Dubai, Abu Dhabi, Sharjah locations
        const locations = [
            {
                name: "Dubai",
                coords: [25.2048, 55.2708],
                type: "hq",
                title: "Middle East HQ (Dubai)",
                desc: "GIG Tower, Sheikh Zayed Road, DIFC. Regional control, administrative & strategy offices."
            },
            {
                name: "Abu Dhabi",
                coords: [24.4539, 54.3773],
                type: "hub",
                title: "Manufacturing Hub (Abu Dhabi)",
                desc: "Mussafah Industrial Area. Heavy metal manufacturing & high-capacity aerospace parts forging."
            },
            {
                name: "Sharjah",
                coords: [25.3463, 55.4209],
                type: "hub",
                title: "Logistics Hub (Sharjah)",
                desc: "Al Sajaa Industrial Center. Next-generation packaging, supply routing, & logistics gateway."
            }
        ];

        // Add markers and interactive tooltips/popups
        locations.forEach(loc => {
            const icon = loc.type === 'hq' ? hqIcon : hubIcon;
            const marker = L.marker(loc.coords, { icon: icon }).addTo(map);
            
            const popupContent = `
                <div class="gig-popup">
                    <h4 style="font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; color: #00355f; margin: 0 0 6px 0;">${loc.title}</h4>
                    <p style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #42474f; margin: 0;">${loc.desc}</p>
                </div>
            `;
            marker.bindPopup(popupContent, {
                closeButton: false,
                offset: L.point(0, -2)
            });

            // Hover interactions
            marker.on('mouseover', function () {
                this.openPopup();
            });
        });
    }
});
