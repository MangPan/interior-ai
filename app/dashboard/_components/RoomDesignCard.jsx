import React from "react";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';


function RoomDesignCard({ room }) {
    return (
        <div>
            <ReactBeforeSliderComponent
                firstImage={{
                    imageUrl: room?.aiImage,
                }}
                secondImage={{
                    imageUrl: room?.orgImage,
                }}
            />
            <div>
                <p>🏠 Room Type : {room.roomType}</p>
                <p>🎨 Design Type : {room.designType}</p>
            </div>
        </div>
    )
}

export default RoomDesignCard;