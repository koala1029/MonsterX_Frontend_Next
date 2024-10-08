"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileInput from "@/app/components/ui/FileInput";
import { useEffect, useState } from "react";
import { userServices } from "@/services/supplier";
import BaseButton from "@/app/components/ui/BaseButton";
import ContactInfo from "@/app/components/Modules/ContactInfo";
import ShippingInfo from "@/app/components/Modules/ShippingInfo";
import PropertiesInfo from "@/app/components/Modules/Properties";

export default function Settings() {
  const [formData, setFormData] = useState({
    avatar: null,
    cover: null,
    username: null,
    email: null,
    bio: null,
    facebook: null,
    twitter: null,
    instagram: null,
    website: null,
  })

  const handleFileChange = (file: any, type: string) => {
    if (type === "avatar") setFormData({ ...formData, avatar: file });
    if (type === "cover") setFormData({ ...formData, cover: file });
  };

  const update = async () => {
    const json = {
      ...formData,
      userImage: formData.avatar,
      bannerImage: formData.cover,
    }

    const response = await userServices.updateProfile(json as any);

    if (response) {
      window.location.reload();
    }
  }

  const cancelChanges = async () => {
    setFormData({
      avatar: null,
      cover: null,
      username: null,
      email: null,
      bio: null,
      facebook: null,
      twitter: null,
      instagram: null,
      website: null,
    })
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await userServices.getSingleUser();

      if (response.data) {
        const user = response.data.user;
        setFormData({
          website: user.Website,
          bio: user.bio,
          email: user.email,
          username: user.username,
          instagram: user.instagram,
          twitter: user.twitter,
          facebook: user.facebook,
          avatar: user.avatar ? user.avatar.url : null,
          cover: user.banner ? user.banner.url : null,
        })
      }
    }

    fetchUserDetails()
  }, [])
  return (
    <div className="flex flex-col gap-y-4 px-4">
      <div className="w-full justify-center items-center">
        <p className="text-center text-xl font-medium">Edit Profile</p>
      </div>

      <div className="w-full flex flex-col gap-y-5 mt-5">
        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Edit your avatar</Label>
          <hr className="bg-white" />
          <div className="flex gap-x-4 items-center my-5">
            {
              formData.avatar ?
                <img src={formData.avatar} alt="cover" className="w-28 h-28 object-cover rounded-full" />
                :
                <div className="w-28 h-28 rounded-full bg-black"></div>
            }
            <FileInput
              title="Upload a new avatar"
              subtitle="JPEG 100x100"
              onFileSelect={(file: any) => handleFileChange(file, "avatar")}
            />
          </div>
        </div>

        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Edit your cover image</Label>
          <hr className="bg-white" />
          <div className="flex gap-x-4 items-center my-5">
            {
              formData.cover ?
                <img src={formData.cover} alt="cover" className="w-28 h-28 object-cover rounded-full" />
                :
                <div className="w-28 h-28 rounded-full bg-black"></div>
            }
            <FileInput
              title="Upload a new banner"
              subtitle="JPEG 100x100"
              onFileSelect={(file: any) => handleFileChange(file, "cover")}
            />
          </div>
        </div>

        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Basic Information</Label>
          <hr className="bg-white" />
          <div className="mt-5 flex gap-x-3">
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">Username</Label>
              <Input value={formData.username ? formData.username : ''} onChange={(e) => setFormData({ ...formData, username: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your username" />
            </div>
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">Email Address</Label>
              <Input value={formData.email ? formData.email : ''} onChange={(e) => setFormData({ ...formData, email: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your email" />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 mt-2">
            <Label className="font-medium">Your Bio</Label>
            <Textarea value={formData.bio ? formData.bio : ''} onChange={(e) => setFormData({ ...formData, bio: (e.target as any).value })} className="w-full border-none bg-[#161616]" placeholder="Say something about yourself" />
          </div>
        </div>

        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
          <Label className="text-lg font-medium">Your links</Label>
          <hr className="bg-white" />
          <div className="mt-5 flex gap-x-3">
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">Website</Label>
              <Input value={formData.website ? formData.website : ''} onChange={(e) => setFormData({ ...formData, website: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your website link" />
            </div>
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">X(Twitter)</Label>
              <Input value={formData.twitter ? formData.twitter : ''} onChange={(e) => setFormData({ ...formData, twitter: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your twitter link" />
            </div>
          </div>
          <div className="mt-2 flex gap-x-3">
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">Facebook</Label>
              <Input value={formData.facebook ? formData.facebook : ''} onChange={(e) => setFormData({ ...formData, facebook: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your facebook link" />
            </div>
            <div className="flex flex-col gap-y-2 basis-1/2">
              <Label className="font-medium">Instagram</Label>
              <Input value={formData.instagram ? formData.instagram : ''} onChange={(e) => setFormData({ ...formData, instagram: (e.target as any).value })} className="w-full border-none bg-[#161616]" type="text" placeholder="Enter your instagram link" />
            </div>
          </div>
        </div>

        <ShippingInfo />  
        <ContactInfo />
        <PropertiesInfo />

        <div className="flex gap-x-4 justify-center my-10">
          <BaseButton title="Cancel" variant="secondary" onClick={cancelChanges} />
          <BaseButton title="Save" variant="primary" onClick={update} />
        </div>
      </div>
    </div>
  )
}
