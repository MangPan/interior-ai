import React from 'react'

function AdditionalReq({ additionalReqInput }) {
    return (
        <div>
            <div className='label'>
                <span className='label-text'>
                    Enter Additional Requirements(Optional)
                </span>
            </div>
            <textarea className='textarea textarea-bordered h-24 w-full'
                onChange={(e) => additionalReqInput(e.target.value)}></textarea>
        </div>
    )
}

export default AdditionalReq