import { MapContainer, 
        TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomMarker from './CustomMarker'


// Responsive map style
const leafletcontainer = {
    height: '50vh', 
    width: '100wh'
};

export default function Map(props) {
    // Coordinate di Bologna
    const BOLOGNA_COORDS = [44.494887, 11.3426163];
    return (
        <>
            <div className="dark:bg-gray-900 bg-white">
                <MapContainer center={BOLOGNA_COORDS} zoom={5} scrollWheelZoom={true} style={leafletcontainer}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {props.tweetPlaces.map((place) => {
                        const tweetIndex = place.index;
                        return (
                        <CustomMarker
                            placeName={place.name}
                            position={place.position}
                            text={props.textTweets[tweetIndex].text}
                            username={props.users[tweetIndex].username}
                            pfpUrl={props.users[tweetIndex].pfpUrl}
                            name={props.users[tweetIndex].name}
                            type={props.types[tweetIndex]}
                            key={tweetIndex}
                        />                            
                    )})}
                </MapContainer>
            </div>
        </>
    );
}