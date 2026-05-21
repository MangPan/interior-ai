"use client"
import axios from 'axios';
import React, { useState } from 'react';
import ImageSelection from './_components/ImageSelection';
import RoomType from './_components/RoomType';
import DesignType from './_components/DesignType.jsx';
import AdditionalReq from './_components/AdditionalReq';
import { storage } from '@/config/firebaseConfig';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/nextjs';
import CustomLoading from './_components/CustomLoading';
import AiOutputDialog from './_components/AiOutputDialog';
import { useContext } from "react"
import { UserDetailContext } from "../../_context/UserDetailContext"
import { db } from "../../../config/db"
import { Users } from "../../../config/schema"
import { eq } from "drizzle-orm"

function CreateNew() {

    const { user } = useUser();
    const [formData, setFormData] = useState([]);
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [loading, setLoading] = useState(false);
    const [aiOutputImage, setAiOutputImage] = useState();
    const [openOutputDialog, setOpenOutputDialog] = useState(false);
    const [orgImage, setOrgImage] = useState();


    const generateAllImage = async () => {
        setLoading(true);

        const rawImageUrl = await saveRawImageToFireBase();

        const result = await axios.post('/api/interior-ai',
            {
                imageUrl: rawImageUrl,
                roomType: formData?.roomType,
                designType: formData?.designType,
                additionalReq: formData?.additionalReq,
                userEmail: user?.primaryEmailAddress?.emailAddress
            });

        setAiOutputImage(result.data.result);
        setOpenOutputDialog(true);
        setLoading(false);
        await updateUserCredits();
        console.log("result", result.data);
        console.log("< by 2025810083 강민준 >")
    }

    const saveRawImageToFireBase = async () => {
        const fileName = `${Date.now()}_raw.png`;
        const imageRef = ref(storage, `interior-ai/${fileName}`);

        await uploadBytes(imageRef, formData.image).then(resp => {
            console.log("File Uploaded... by 2025810083 강민준");
        })

        const downloadUrl = await getDownloadURL(imageRef);
        setOrgImage(downloadUrl);
        console.log(downloadUrl);

        return downloadUrl;
    }

    const updateUserCredits = async () => {
        if (!userDetail) {
            console.error("userDetail이 없습니다.")
            return
        }

        if (userDetail.credits <= 0) {
            alert("크레딧이 부족합니다.")
            return
        }

        const result = await db
            .update(Users)
            .set({
                credits: userDetail.credits - 1,
            })
            .where(eq(Users.id, userDetail.id))
            .returning({ id: Users.id })

        if (result) {
            setUserDetail((prev) => ({
                ...prev,
                credits: userDetail.credits - 1,
            }))
        }
    }

    const onHandleInputChange = (value, fieldName) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));

        console.log(formData);
    }
    return (
        <div>
            <h2 style={{
                color: 'purple',
                fontWeight: 'bold',
                fontSize: '2.5rem',
                textAlign: 'center'
            }}>
                Create AI Interior
            </h2>
            {loading ? (
                <CustomLoading />
            ) :
                (
                    <div className='grid grid-cols-2 gap-8 p-6'>
                        <div>
                            <ImageSelection
                                selectedFile={(value) =>
                                    onHandleInputChange(value, 'image')
                                } />
                        </div>
                        <div>
                            <RoomType
                                selectedRoomType={(value) =>
                                    onHandleInputChange(value, 'roomType')
                                }
                            />
                            <DesignType
                                selectedDesignType={(value) =>
                                    onHandleInputChange(value, 'designType')
                                } />
                            <AdditionalReq
                                additionalReqInput={(value) =>
                                    onHandleInputChange(value, 'additionalReqInput')}
                            />
                            <button onClick={generateAllImage} className='btn btn-primary w-full'>
                                Generate
                            </button>
                        </div>
                        <AiOutputDialog
                            openDialog={openOutputDialog}
                            setOpenDialog={setOpenOutputDialog}
                            orgImage={orgImage}
                            aiImage={aiOutputImage}
                        />
                    </div>
                )}
            <p className='text-gray-500'>
                Each generation costs one credit
            </p>
        </div>
    );


}

export default CreateNew;