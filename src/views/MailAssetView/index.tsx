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
import { useMemo } from "react";
import { formatDistanceToNow } from 'date-fns'
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

    const [transferModalOpen, toggleTransferModalOpen] = useToggle();
    const [burnModalOpen, toggleBurnModalOpen] = useToggle();
    const [showReplyModal, toggleReplyModal] = useToggle();

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

    const formSubmit = async (data: FormValues) => {
        console.log("Form submitted");
        // setLoading(true);
    }

    const onError = (errors: FieldErrors<FormValues>) => {
        // setLoading(false);
        console.log("Form errors", errors);
    };

    return (
        <Container>
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

            <div className="pt-16">
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

            <Button type="secondary" className="mt-4" onClick={toggleReplyModal}>
                Reply
            </Button>

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

            <Modal open={showReplyModal} size="3xl">

                <Card className="p-8 space-y-8">

                    <div className="flex items-center justify-between space-x-8">
                        <Header
                            title="Reply"
                        />

                    </div>

                    <form onSubmit={handleSubmit(formSubmit, onError)} noValidate className="space-y-6">
                        <div className="flex justify-between items-center">
                            <TextArea className="w-full" rows={10}
                                {...register("reply", {
                                    required: { value: true, message: "Content is required" },
                                })}
                                error={errors.reply}
                            />
                        </div>

                        <div className="flex justify-between items-end">
                            <Button type="secondary" onClick={toggleReplyModal}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Reply</Button>
                        </div>
                    </form>
                </Card>

            </Modal>
        </Container>


    );
};
