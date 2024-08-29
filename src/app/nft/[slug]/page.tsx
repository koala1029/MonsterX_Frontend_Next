"use client"

import NftServices from "@/services/nftService"
import { useEffect, useState } from "react"
import Image from "next/image";
import { NFTItemType } from "@/types";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllNftActivitys } from "@/services/supplier";
import moment from "moment";
import { FavoriteService } from "@/services/FavoriteService";
import BaseButton from "@/app/components/ui/BaseButton";
import { BaseDialog } from "@/app/components/ui/BaseDialog";
import BuyModal from "@/app/components/Modules/nft/BuyModal";
import BidModal from "@/app/components/Modules/nft/BidModal";
import Quotes from "@/app/components/Modules/nft/Quotes";
import { getNftDataById } from "@/utils/nftutils";
import { contract } from '@/lib/contract';
import {
    prepareContractCall,
    sendTransaction,
    readContract,
    resolveMethod,
    prepareEvent,
    getContractEvents,
  } from 'thirdweb';
import { useActiveAccount } from "thirdweb/react";
import { ethers } from "ethers";
export default function Page({ params }: { params: { slug: string } }) {
    console.log("NFT params", params);
    const activeAccount = useActiveAccount();
    const nftService = new NftServices();
    const favoriteService = new FavoriteService();

    const [data, setData] = useState<null | NFTItemType>(null)
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [views, setViews] = useState(0);
    const [list, setList] = useState([]);
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [nftData, setNftData] = useState({})

    const handleLike = async () => {
        try {
            setLiked(!liked)
            if (!liked === true) setLikes(likes + 1)
            else if (!liked === false) setLikes(likes - 1)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllNftActivity = async (id: string) => {
        try {
            const {
                data: { data },
            } = await getAllNftActivitys({ nftId: id })

            console.log("setList", data);
            setList(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getArtitsLikes = async () => {
        try {
            const {
                data: { totalLikedNfts },
            } = await favoriteService.getNftTotalLikes({ nftId: "6641aa41ce4eabdbb75aacf4" })
            const {
                data: { favorite },
            } = await favoriteService.getUserReactionToNft({ nftId: "6641aa41ce4eabdbb75aacf4" })
            console.log("setLikes", totalLikedNfts);
            console.log("setLiked", favorite);
            setLikes(totalLikedNfts)
            setLiked(favorite)
        } catch (error) {
            console.log(error)
        }
    }

    const handleView = async () => {
        try {
            const previosIpAddress = localStorage.getItem("ipAddress")
            const {
                data: { views, ipAddress },
            } = await nftService.addView({ nftId: data?._id, ip: previosIpAddress })
            localStorage.setItem("ipAddress", ipAddress)
            console.log("serviews", views);
            setViews(views)
        } catch (error) {
            console.log({ error })
        }
    }

    const handleBuy = async () => {
        console.log("handle buy");
        try {
            const tokenId = params.slug;
            const tokenDetails =  await readContract({ 
                contract, 
                method: "tokenDetails", 
                params: [BigInt(tokenId)] 
            });
            console.log("tokenDetails", tokenDetails);
            const transaction = prepareContractCall({
                contract,
                method: 'purchaseAsset',
                params: [
                    BigInt(tokenId)
                ],
                value: tokenDetails[4],
            });
                
            if (activeAccount) {
                try {
                    const { transactionHash } = await sendTransaction({
                        transaction,
                        account: activeAccount,
                    });
                } catch (error) {
                    console.log("error:", error);
                }
            } else {
                alert("wallet is not connected");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleBid = async (data: number) => {
        console.log("handle bid", data);
        try {
            const tokenId = params.slug;
            const tokenDetails =  await readContract({ 
                contract, 
                method: "tokenDetails", 
                params: [BigInt(tokenId)] 
            });
            console.log("tokenDetails", tokenDetails);
            const transaction = prepareContractCall({
                contract,
                method: 'placeBid',
                params: [
                    BigInt(tokenId)
                ],
                value: BigInt(data * 1e18),
            });
                
            if (activeAccount) {
                try {
                    const { transactionHash } = await sendTransaction({
                        transaction,
                        account: activeAccount,
                    });
                } catch (error) {
                    console.log("error:", error);
                }
            } else {
                alert("wallet is not connected");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchNftData = async () => {
            const nft = await getNftDataById(Number(params.slug));
            console.log("NFT", nft);
            setNftData(nft);
            console.log("image url", "https://" + (nftData as any).cloudinaryUrl);
            
            try {
                const response = await nftService.getNftById("6641aa41ce4eabdbb75aacf4")

                console.log("setData", response.data?.nft);
                if (list.length === 0) {
                    getAllNftActivity("6641aa41ce4eabdbb75aacf4")
                    getArtitsLikes()
                    handleView()
                }
                setData(response.data?.nft)
            } catch (error) {
                console.log(error)
                setData(null)
            }
           
        }

        fetchNftData()
    }, [params.slug])
    useEffect(() => { console.log("image url", "https://" + (nftData as any).cloudinaryUrl);},[nftData]);
    return (
        <div className="flex flex-col gap-y-4 py-20 w-full px-10 lg:px-20">
            {data && (<>
                <div className="flex flex-col gap-y-3 items-center lg:flex-row lg:justify-between">
                    <div className="w-full relative lg:w-[55%]">
                        <Image src={mainImage ? mainImage :  "https://" + (nftData as any).cloudinaryUrl} height={512} width={512} quality={100} alt="hero" className="cursor-zoom-in rounded-xl object-cover aspect-square w-full" />

                        <div className="absolute top-4 right-4 flex w-[80px] pl-[15px] rounded-[30px] gap-x-3 p-3 border-2 items-center bg-gray-700 cursor-pointer">
                            <span className="font-medium">{likes}</span>
                            <div
                                onClick={() => handleLike()}
                            >
                                <input
                                    title="like"
                                    type="checkbox"
                                    className="sr-only"
                                    checked={liked}
                                />
                                <div className="checkmark">
                                    {
                                        liked ?
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff" strokeWidth="1.5"><path fillRule="evenodd" clipRule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#fff"></path></svg>
                                            :
                                            <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
                                    }
                                </div>
                            </div>
                        </div>

                        <Image alt="rwa" src="/images/rwa-logo.svg" height={100} width={100} quality={100} className="w-20 h-16 absolute bottom-3 right-4" />
                    </div>

                    <div className="flex flex-col gap-y-3 justify-center text-white w-full lg:w-[43%]">
                        <div className="w-full flex flex-col gap-y-6">
                            <p className="text-lg font-medium">{(nftData as any).name}</p>
                            <div className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <img src={data?.owner?.avatar?.url} alt="avatar" className="w-8 h-8 rounded-full" />
                                    <div className="flex flex-col gap-y-1 text-sm">
                                        <p className="text-gray-400">Owned by:</p>
                                        <p className="font-medium">{data?.owner?.username}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <img src={data?.mintedBy?.avatar?.url} alt="avatar" className="w-8 h-8 rounded-full" />
                                    <div className="flex flex-col gap-y-1 text-sm">
                                        <p className="text-gray-400">Created by:</p>
                                        <p className="font-medium">{data?.mintedBy?.username}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-x-3">
                                <div className="flex gap-x-2 items-center border-2 border-gray-400 px-3 py-2 rounded-xl">
                                    {views} view
                                </div>
                                <div className="flex gap-x-2 items-center border-2 border-gray-400 px-3 py-2 rounded-xl">
                                    Pop Art
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-y-3 bg-dark p-6 rounded-lg">
                            <p className="text-sm text-gray-400">Current Price</p>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-y-2">
                                    <p className="text-lg font-medium">{(nftData as any).price}</p>
                                    <button className="bg-[#DDFE47] hover:bg-[#c0e83e] text-black font-bold py-3 px-4 rounded w-full mt-2" onClick={handleBuy}>
                                        Buy Now
                                    </button>
                                    {/* <BaseDialog
                                        trigger={
                                            <BaseButton 
                                                title="Buy Now" 
                                                variant="primary" 
                                                onClick={() => {  }} 
                                            />
                                        }
                                        className="bg-black max-h-[80%] overflow-y-auto overflow-x-hidden"
                                    >
                                        <BuyModal price={(nftData as any).price} />
                                    </BaseDialog> */}


                                <BaseDialog
                                trigger={
                                    <BaseButton title="Bid" variant="primary" onClick={() => console.log("click")} />
                                }
                                className="bg-black max-h-[80%] w-[28rem] overflow-y-auto overflow-x-hidden"
                                >
                                <BidModal 
                                    title={(nftData as any).name} 
                                    update={(value) => handleBid(value)} 
                                />
                                </BaseDialog>

                                </div>
                                <div>
                                <BaseDialog
                                    trigger={
                                        <span className="cursor-pointer px-3 py-2 rounded-xl border-2 border-white">
                                        Check Matic Quotes
                                        </span>
                                    }
                                    className="bg-black max-h-[80%] overflow-y-auto overflow-x-hidden"
                                >
                                    <Quotes 
                                        nft={data} 
                                        fee={10} 
                                        contractInfo={{
                                        address: '44932KJKLJ12'
                                        }} 
                                    />
                                </BaseDialog>

                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-3 bg-dark p-6 rounded-lg">
                            <p className="text-lg font-medium">Overview</p>
                            <hr />
                            <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                <span className="font-medium">Artist</span>
                                <span className="text-gray-400">{(nftData as any).name}</span>
                            </div>
                            <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                <span className="font-medium">Shipping Country</span>
                                <span className="text-gray-400">{"Singapore"}</span>
                            </div>
                            <div className="flex px-4 py-2 rounded-md justify-between items-center border-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                <span className="font-medium">Royalties</span>
                                <span className="text-gray-400">{Number((nftData as any).royalty.royaltyPercentage)}%</span>
                            </div>
                            {/* <div className="flex px-4 py-2 flex-col rounded-md border-2 gap-y-2 border-gray-500 bg-gradient-to-br from-[#ffffff0f] to-[#32282808]">
                                <p className="font-medium">Size</p>
                                <div className="mt-2 flex flex-col gap-y-2">
                                    <p>Length: {(nftData as any).attributes[0].value && ""}</p>
                                    <p>Height: {(nftData as any).attributes[1].value && ""}</p>
                                    <p>Width: {(nftData as any).attributes[2].value && ""}</p>
                                    <p>Weight: {(nftData as any).attributes[3].value && ""}</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                    <div className="w-full flex gap-5 flex-wrap">
                        {
                            [(nftData as any).cloudinaryUrl, ...(nftData as any).attachments].map((item, index) => {
                                return (
                                    <img key={index} onClick={() => {
                                        setMainImage("https://" + item)
                                    }} src={"https://" + item} className="w-[16rem] opacity-60 hover:opacity-100 tra rounded aspect-square object-cover" />
                                )
                            })
                        }
                    </div>

                    <div className="w-full flex flex-col gap-y-5 mt-5">
                        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                            <Label className="text-lg font-medium">Properties</Label>
                            <hr className="bg-white" />
                            <div className="flex gap-4 flex-wrap">
                                {
                                    data?.attributes.map((attr: any, index) => {
                                        return (
                                            <div className="w-[18rem] py-4 rounded-lg flex justify-center flex-col gap-y-2 border-2 border-gray-400" key={index}>
                                                <p className="text-lg font-medium text-center">{attr.type}</p>
                                                <p className="font-medium text-center">{attr.value}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-y-5 mt-5">
                        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                            <Label className="text-lg font-medium">Description</Label>
                            <hr className="bg-white" />
                            <p className="text-gray-500">{(nftData as any)?.description}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-y-5 mt-5">
                        <div className="w-full rounded-md px-4 py-3 bg-dark flex flex-col gap-y-2">
                            <Label className="text-lg font-medium">Item activity</Label>
                            <hr className="bg-white" />
                            <Table>
                                <TableCaption>A list of your item activity.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Event</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>From</TableHead>
                                        <TableHead>To</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {FileList.length > 0 && list.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.state}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.paymentStatus}</TableCell>
                                            <TableCell>{item.paymentMethod}</TableCell>
                                            <TableCell>{moment(item.createdAt).format('DD MMM, YY')}</TableCell>
                                            <TableCell className="text-right">{moment(item.createdAt).format('hh:mm A')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-2 bg-dark rounded-md py-4">
                        <div className="w-full flex flex-col gap-y-5">
                            <div className="w-full px-6 py-2 flex">
                                <Label className="text-lg font-medium">Details</Label>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-5">
                            <div className="w-full px-6 py-2 flex">
                                <Label className="text-lg font-medium">Erc721</Label>
                                <hr className="bg-white" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-5">
                            <div className="w-full px-6 py-2 flex">
                                <Label className="text-lg font-medium">View on Polygon Scan</Label>
                                <hr className="bg-white" />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-y-5">
                            <div className="w-full px-6 py-2 flex">
                                <Label className="text-lg font-medium">Open Original On IPFS</Label>
                                <hr className="bg-white" />
                            </div>
                        </div>
                    </div>
            </>)}
        </div>
    );
}