import Pin from 'leaflet/dist/images/marker-icon.png'
import { Icon } from 'leaflet'
import { Popup, Marker } from 'react-leaflet';
import { getPrefix } from '../utils/tweets';

const CustomMarker = (props) => {
    const textTypeTweet = getPrefix(props.type);
    return (
        <Marker 
            position={props.position}
            icon={new Icon({
                iconUrl: Pin,
                iconSize: [26,40],
                iconAnchor: [13, 40]  
            })}>
            <Popup className="md:w-80 w-52 max-w-100">
                <div className="flex flex-col w-100 overflow-hidden">
                    <span className="inline-flex flex-row">
                        <img src={props.pfpUrl} alt="immagine profilo"></img>
                        <span className="inline-block align-bottom"><b className="text-cyan-600">{props.name} (@{props.username}) </b></span>
                    </span>
                    <p className="w-100 overflow-hidden">
                        {textTypeTweet}: {props.text}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};
export default CustomMarker;