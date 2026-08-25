document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('gig-leaflet-map');
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('gig-leaflet-map', {
            center: [23.8, 47.2],
            zoom: 5.5,
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
        const uaeIcon = L.divIcon({
            className: 'gig-marker-hq',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8]
        });

        const ksaIcon = L.divIcon({
            className: 'gig-marker-hub',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8]
        });

        // Dubai (UAE) & Jeddah (KSA) office locations
        const locations = [
            {
                name: "Dubai Office",
                country: "United Arab Emirates",
                coords: [25.2104, 55.2818],
                icon: uaeIcon,
                title: "Dubai Office",
                poBox: "P.O.Box 506820",
                address: "7th Floor, Dubai International Financial Centre (DIFC) – Gate Village 7<br>Dubai, UAE",
                phones: ["+971 4 304 0000"],
                fax: "+971 4 304 0004"
            },
            {
                name: "Jeddah Office",
                country: "Kingdom of Saudi Arabia",
                coords: [21.4299, 39.2148],
                icon: ksaIcon,
                title: "Jeddah Office",
                poBox: "P.O. Box 8281",
                address: "Jeddah 21482, Industrial City – Phase 1<br>Kingdom of Saudi Arabia",
                phones: ["+966 12 608 2709", "+966 12 608 2712"],
                fax: "+966 12 637 7985"
            }
        ];

        const markersGroup = L.featureGroup();

        // Add markers and interactive popups
        locations.forEach(loc => {
            const marker = L.marker(loc.coords, { icon: loc.icon }).addTo(map);
            markersGroup.addLayer(marker);

            const phoneLines = loc.phones.map(p => `<div>T: <a href="tel:${p.replace(/\s+/g, '')}" style="color: #00355f; text-decoration: none;">${p}</a></div>`).join('');
            const faxLine = loc.fax ? `<div>F: ${loc.fax}</div>` : '';
            const phoneFaxHtml = `
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); font-family: 'Inter', sans-serif; font-size: 12px; color: #00355f; font-weight: 600; line-height: 1.5;">
                    ${phoneLines}
                    ${faxLine}
                </div>
            `;

            const popupContent = `
                <div class="gig-popup">
                    <div style="font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 700; color: #727780; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 2px;">${loc.country}</div>
                    <h4 style="font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: #00355f; margin: 0 0 4px 0;">${loc.title}</h4>
                    <p style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.45; color: #42474f; margin: 0;">
                        <span style="font-weight: 500; color: #191c1e;">${loc.poBox}</span><br>
                        ${loc.address}
                    </p>
                    ${phoneFaxHtml}
                </div>
            `;

            marker.bindPopup(popupContent, {
                closeButton: false,
                offset: L.point(0, -2)
            });

            // Hover / click interactions
            marker.on('mouseover', function () {
                this.openPopup();
            });
        });

        // Fit map bounds to show both offices perfectly with padding
        if (locations.length > 0) {
            map.fitBounds(markersGroup.getBounds(), {
                padding: [60, 60],
                maxZoom: 6
            });
        }
    }
});
