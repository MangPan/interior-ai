import React from 'react'

function RoomType({selectedRoomType}) {
    return (
        <div>
            <label>Select Room Type</label>
            <div>
                <select
                    className='select select-bordered w-full max-w-xs'
                    onChange={(e) => selectedRoomType(e.target.value)}
                    required
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select Room Type
                    </option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Office">Office</option>
                    <option value="Bathroom">Bathroom</option>
                </select>
            </div>
        </div>
    )
}

export default RoomType;