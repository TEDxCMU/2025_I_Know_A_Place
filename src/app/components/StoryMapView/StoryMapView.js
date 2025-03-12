import { useState, useEffect } from "react";
import { useMap, MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Dialog, DialogContent } from '@mui/material';
import "leaflet/dist/leaflet.css";

import styles from './StoryMapView.module.css';
import StorySubmit from '../StorySubmit/StorySubmit';

const markerIcon = L.icon({
    iconUrl: '/marker.svg',
    // shadowUrl: 'leaf-shadow.png',
    iconSize: [32, 32], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
});

const position = [40.442, -79.942];

function ClickComponent({ selectionMarker, setSelectionMarker, handleClickOpen }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setSelectionMarker({ lat, lng });
            setTimeout(() => {
                handleClickOpen(true);
            }, 300);
        },
    });

    if (selectionMarker) {
        return (
            <Marker position={selectionMarker} icon={markerIcon} />
        )
    }

    return null;
    }

    function MapResizer() {
        const map = useMap();
        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 300);
        }, [map]);
        return null;
    }

    function StoryMapView() {
        const [stories, setStories] = useState([]);
        const [selectionMarker, setSelectionMarker] = useState(null);
        const [open, setOpen] = useState(false);
        const [map, setMap] = useState(null); 
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            async function fetchData() {
                try {
                    const res = await fetch("/api/sheets");
                    const result = await res.json();
                    const fetchedStories = result.stories.stories;
                    if (Array.isArray(fetchedStories)) {
                        setStories(fetchedStories);
                    } else {
                        console.error("Expected an array of stories, but got:", fetchedStories);
                        setStories([]);  // Default to empty array if the data is malformed
                    }
                } catch (error) {
                    console.error("Failed to fetch data", error);
                } finally {
                    setLoading(false); 
                }
            }
        
            fetchData();
        }, []);
        
        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = (e) => {
            setOpen(false);
        };

        if (loading) return (
        <div style={{ 
            height: "76vh", 
            display: "flex", 
            justifyContent: "center",  // Centers horizontally
            alignItems: "center",  // Centers vertically
            textAlign: "center" 
        }}>
            <p>Loading stories</p>
        </div>
        );

        return (
            <div className={styles.container}>
                <MapContainer 
                className={styles.map} 
                center={position} 
                maxBounds={[[80, -205], [-80, 205 ]]}
                zoom={16}
                minZoom={3}
                scrollWheelZoom={true} 
                whenCreated={setMap}>
                    <MapResizer />
                    <ClickComponent
                        selectionMarker={selectionMarker}
                        setSelectionMarker={setSelectionMarker}
                        handleClickOpen={handleClickOpen}
                    />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                    />
                    <MarkerClusterGroup>
                        {stories?.map((data, id) => {
                            if (!data) {
                                console.error("No data for story", id);
                                return null;  // Skip if no data
                            }

                            const latLong = data[4];
                            const cleanedLatLong = latLong.replace(/^"|"$/g, '').replace(/\\"/g, '"');

                            let position;
                            try {
                                position = JSON.parse(cleanedLatLong);

                                // Ensure position is valid
                                if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') {
                                    throw new Error("Invalid position format");
                                }
                            } catch (error) {
                                console.error("Invalid latLong format:", latLong, error);
                                return null;  // Skip if parsing fails or data is invalid
                            }

                            // Check if position is valid before rendering the Marker
                            if (!position.lat || !position.lng) {
                                console.error("Invalid position data", position);
                                return null;
                            }

                            return (
                                <Marker key={id} position={position} icon={markerIcon}>
                                    <Popup className={styles.popup}>
                                        <p style={{fontSize: "16px", margin:"0 0 10px 0"}}><strong>{data[0]}</strong></p>
                                        <hr/>
                                        {data[1] && <p style={{ fontSize:"14px", margin: "10px 0 10px 0" }}><strong>{data[1]}</strong></p>}
                                        <div>
                                            <p style={{fontSize:"14px", margin: "0 0 20px 0" }}>{data[2]}</p>
                                            <div style={{display:"flex", flexWrap:"wrap"}}>
                                                {JSON.parse(data[3]).map((item, id) =>                                 
                                                    <button key={id} className={styles.tag}>{item.tag} </button>)
                                                }
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
                <Dialog 
                    PaperProps={{
                        style: { borderRadius:"16px", padding:0},
                    }}
                    open={open} onClose={handleClose}>
                    <DialogContent 
                    className={styles.dialogBox} >
                        <StorySubmit latLong={selectionMarker} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    export default StoryMapView;
