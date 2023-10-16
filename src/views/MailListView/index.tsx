// YourComponent.js

import { Error } from "@/components/Error";
import { LoadingSection } from "@/components/LoadingSection";
import { MediaObject } from "@/components/MediaObject";
import { Button } from "@/components/Button";
import { useMailApi } from "@/hooks/useMailApi";
import { useRef, useState } from "react";

function MailListView() {

    const [page, setPage] = useState(1);
    const { data, loading, error } = useMailApi(`/api/mail?page=${page}&limit=50`);

    if (loading) {
        return <LoadingSection />
    }

    if (error) {
        <Error error={error} />
    }

    /* ts-ignoring this because if we see the object keys via "data.", it shows 
        {items, limit, page, total}
       But the actual object is { assets: {items, limit, page, total} }
       An SDK error, I guess, package update will fix this
    */
    /* @ts-ignore */
    const { assets: { items } } = data!;

    if (!items || items.length === 0) {
        return <div>
            <h1 className="text-white">No Mails Found...</h1>

            {/* Prev, Next Buttons */}
            <div className="flex items-end justify-end mt-4">
                <Button type="secondary" className="mr-2" onClick={() => {
                    if (page > 1)
                        setPage((prevPage) => prevPage - 1);
                }}>Prev</Button>
                <Button type="secondary" onClick={() => {
                    if (items.length > 0)
                        setPage((prevPage) => prevPage + 1);
                }}>Next</Button>
            </div>
        </div>
    }

    return (
        <div className="h-max-96 overflow-y-auto">
            {items.map((item: any, index: number) => (
                <a key={index} href={`/mail/${item.id}`} target="_blank">
                    <div
                        className="border-b p-2 text-white cursor-pointer hover:bg-gray-700"
                    >
                        <MediaObject
                            title={item.content.metadata.name}
                            description={item.content.metadata.description}
                            className="text-gray-200 truncate"
                        />
                    </div>
                </a>
            ))}

            {/* Prev, Next Buttons */}
            <div className="flex items-end justify-end mt-4">
                <Button type="secondary" className="mr-2" onClick={() => {
                    if (page > 1)
                        setPage((prevPage) => prevPage - 1);
                }}>Prev</Button>
                <Button type="secondary" onClick={() => {
                    if (items.length > 0)
                        setPage((prevPage) => prevPage + 1);
                }}>Next</Button>
            </div>

        </div>
    );
}

export default MailListView;
