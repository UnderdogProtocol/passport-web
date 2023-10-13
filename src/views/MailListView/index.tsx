// YourComponent.js

import { Error } from "@/components/Error";
import { LoadingSection } from "@/components/LoadingSection";
import { MediaObject } from "@/components/MediaObject";
import { useMailApi } from "@/hooks/useMailApi";

function MailListView() {

    const { data, loading, error } = useMailApi("/api/mail");

    if (loading) {
        return <LoadingSection />
    }

    if (error) {
        <Error error={error} />
    }

    /* ts-ignoring this because if we see the object keys via "data.", it shows 
        {items, limit,page,total}
       But the actual object is { assets: {items, limit,page,total} }
       An SDK error, I guess, package update will fix this
    */
    /* @ts-ignore */
    const { assets: { items } } = data!;

    if (!items || items.length === 0) {
        return <h1 className="text-white">No Mails Found...</h1>
    }

    return (
        // TODO: Add pagination
        <div className="max-h-96 overflow-y-auto">
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
        </div>
    );
}

export default MailListView;
