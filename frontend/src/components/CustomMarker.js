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
                <div className="p-3 flex flex-col w-100 overflow-hidden bg-white rounded-lg border shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer">
                    <span className="flex flex-rowitems-center">
                        <img src={props.pfpUrl} className="h-auto w-10 rounded-full" alt="immagine profilo"></img>
                        <div className="flex flex-col md:pl-2 pl-0">
                            <span className="inline-block align-bottom font-bold text-sky-400">{props.name}</span>
                            <span className="inline-block align-bottom font-bold text-sky-400">@{props.username}</span>
                        </div>    
                    </span>
                    <p className="w-100 overflow-hidden dark:text-white">
                        {textTypeTweet}: {props.text}
                    </p>
                    <p className="w-100 overflow-hidden dark:text-white">
                        {props.placeName}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};
export default CustomMarker;