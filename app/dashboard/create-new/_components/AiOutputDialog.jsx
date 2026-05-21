import React, { useEffect } from "react";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css'



function AiOutputDialog({ openDialog, setOpenDialog, orgImage, aiImage }) {
    useEffect(() => {
        if (openDialog) {
            document.getElementById('my_modal_1').showModal();
        }
    }
        , [openDialog]);

    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Result:</h3>
                    <span className="text-xs text-gray-400 font-mono">by 2025810083 강민준</span>
                </div>

                <ReactBeforeSliderComponent
                    firstImage={{
                        imageUrl: aiImage
                    }}
                    secondImage={{
                        imageUrl: orgImage
                    }}
                />
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn" onClick={handleClose}>Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default AiOutputDialog;