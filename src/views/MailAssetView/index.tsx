import { BurnModal } from "@/components/BurnModal";
import { Container } from "@/components/Container";
import { Dropdown, DropdownProps } from "@/components/Dropdown";
import { MediaObject } from "@/components/MediaObject";
import { renderNotification } from "@/components/Notification";
import { TransferModal } from "@/components/TransferModal";
import { useAsset } from "@/hooks/useAsset";
import { useToggle } from "@/hooks/useToggle";
import { viewAssetOnXray } from "@/lib";
import { publicKey } from "@metaplex-foundation/umi";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow, sub } from 'date-fns'
import {
    HiMagnifyingGlass,
    HiOutlineArrowUpOnSquare,
    HiOutlineSquare2Stack,
    HiOutlineTrash,
    HiSquare2Stack,
} from "react-icons/hi2";
import { formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Card } from "@/components/Card";
import { Header } from "@/components/MediaObject/Header";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { FieldErrors, useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { ReplyMailSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import httpStatus from "http-status";
import { useSphere } from "@spherelabs/react";
import { useUserContext } from "@/contexts/user";
import { Spin } from "@/components/Spin";
import { useAssetsByOwner } from "@/hooks/useAssetsByOwner";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { BsX } from 'react-icons/bs';
import { FaTelegramPlane } from "react-icons/fa";

type FormValues = z.infer<typeof ReplyMailSchema>;

export const MailAssetView = () => {
    const router = useRouter();

    const mintAddress = useMemo(
        () =>
            router.query.mintAddress
                ? publicKey(router.query.mintAddress as string)
                : undefined,
        [router.query.mintAddress]
    );

    const { data: assetData } = useAsset(mintAddress);
    // const abc = useAssetsByOwner(assetData?.id);
    const { data: subAssetsData } = useAssetsByOwner(assetData?.id);

    const [transferModalOpen, toggleTransferModalOpen] = useToggle();
    const [burnModalOpen, toggleBurnModalOpen] = useToggle();
    const [showReplyInput, toggleReplyInputOpen] = useToggle();
    const [loading, setLoading] = useState(false);

    const dropdownItems: DropdownProps["items"] = [
        {
            children: (
                <MediaObject
                    title="View on XRAY"
                    media={{ icon: <HiMagnifyingGlass className="h-6 w-6" /> }}
                />
            ),
            onClick: () => assetData && viewAssetOnXray(publicKey(assetData?.id)),
        },
        {
            children: (
                <MediaObject
                    title="Send"
                    media={{ icon: <HiOutlineArrowUpOnSquare className="h-6 w-6" /> }}
                />
            ),
            onClick: toggleTransferModalOpen,
        },
        {
            children: (
                <MediaObject
                    title="Delete"
                    media={{ icon: <HiOutlineTrash className="h-6 w-6" /> }}
                />
            ),
            onClick: toggleBurnModalOpen,
        },
    ];

    const form = useForm<FormValues>({
        resolver: zodResolver(ReplyMailSchema),
    });
    const { handleSubmit, register, formState } = form;
    const { errors } = formState;

    const { payPaymentLink } = useSphere();

    const { address: userPassportAddress } = useUserContext();

    const formSubmit = async (data: FormValues) => {
        console.log("Form submitted");
        setLoading(true);

        const { reply } = data;

        const result = await axios.post('/api/gcp/upload', {
            recipients: assetData?.id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (result.status !== httpStatus.OK) {
            console.log(result.data);
            setLoading(false);
            renderNotification({
                title: "Something went wrong",
                description: `Please try again`,
            })
            return
        }

        const response = result.data;

        console.log("JSON file name");
        console.log(response.data[0].fileName);

        try {
            const res = await payPaymentLink({
                lineItemQuantities: [
                    {
                        lineItemId: `${process.env.NEXT_PUBLIC_SPHERE_LINE_ITEM}`,
                        quantity: 1,
                    }
                ],
                metadata: {
                    subject: assetData?.content?.metadata.name,
                    content: reply,
                    csvFileName: response.data[0].fileName,
                    passportAddress: userPassportAddress,
                    sentAt: new Date().toISOString(),
                }
            })

            console.log(res);

            if (res) {
                renderNotification({
                    title: "Mail sent successfully",
                })
                form.reset();
                setLoading(false);
                toggleReplyInputOpen();
            }

        } catch (e: any) {
            console.log(e);
            setLoading(false);
            renderNotification({
                title: "Error",
                description: `${e.message}`,
            })
        }

    };

    const onError = (errors: FieldErrors<FormValues>) => {
        setLoading(false);
        console.log("Form errors", errors);
    };

    return (
        <Container className="space-y-4">
            <div className="flex justify-between items-center">
                <MediaObject
                    size="4xl"
                    title={assetData?.content?.metadata.name}
                    media={{
                        src:
                            assetData?.content?.files && assetData.content.files.length > 0
                                ? assetData?.content.files[0].uri
                                : undefined,
                        size: "md",
                    }}
                />
                <Dropdown items={dropdownItems} />
            </div>

            <div>
                <ConnectWalletButton type="secondary" className="flex-shrink-0 mt-8" />
            </div>

            {/* First Mail */}
            <div className="">
                {assetData?.content?.metadata.description && (

                    <div className="max-h-screen overflow-y-auto">
                        <div className="text-right text-gray-500 p-2">
                            {`${formatTimestamp(assetData!.content!.metadata!.attributes![1].value)}`}
                        </div>
                        <div className="border b-2">
                            <div className="text-2xl text-white break-words p-4">
                                {assetData?.content?.metadata.description}
                            </div>
                        </div>
                    </div>

                )}
            </div>

            {/* Mail Replies */}
            {subAssetsData && subAssetsData.items.length > 0 && (
                Object.entries(subAssetsData.items).map(([key, value]) => {
                    const timestamp = value!.content!.metadata.attributes![1].trait_type === "sentAt" ? value.content!.metadata!.attributes![1].value : new Date().toISOString();
                    return (
                        <div className="max-h-screen overflow-y-auto mt-8" key={key}>
                            <div className="text-right text-gray-500 p-2">
                                {`${formatTimestamp(timestamp)}`}
                            </div>
                            <div className="border b-2 border-neonGreen-600">
                                <div className="text-2xl text-white break-words p-4">
                                    {value?.content?.metadata.description}
                                </div>
                            </div>
                        </div>
                    )
                }
                ))}

            {/* Reply Input */}
            {showReplyInput && (
                <Card className="space-y-0 bg-transparent">

                    <div className="flex items-end justify-end">
                        <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
                            <BsX size={24} onClick={toggleReplyInputOpen} />
                        </span>
                    </div>

                    <form onSubmit={handleSubmit(formSubmit, onError)} noValidate className="space-y-6">
                        <div className="flex justify-between items-center">
                            <TextArea className="w-full outline-none border-none" rows={5}
                                {...register("reply", {
                                    required: { value: true, message: "Content is required" },
                                })}
                                error={errors.reply}
                            />
                        </div>


                        <div className="flex justify-start items-start">
                            {loading ? (
                                <Spin />
                            ) : (
                                <Button type="primary" htmlType="submit">
                                    <FaTelegramPlane size={24} />
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            )}

            {!showReplyInput && (
                <Button type="secondary" className="mt-4" onClick={toggleReplyInputOpen}>
                    Reply
                </Button>
            )}
            <TransferModal
                open={transferModalOpen}
                onClose={toggleTransferModalOpen}
                size="5xl"
            />

            <BurnModal
                open={burnModalOpen}
                onClose={toggleBurnModalOpen}
                size="5xl"
            />

        </Container>

    );
};
