// YourComponent.js

import { useMailApi } from "@/hooks/useMailApi";
import { MailSchema } from "@/lib/schema";
import { AssetSortBy } from "helius-sdk";

function MailListView() {

    const { data, loading, error } = useMailApi("/api/mail");

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    console.log(data);

    const isDataValid = MailSchema.safeParse(data);
    if (!isDataValid.success) {
        return <h1 className="text-white">Something Went Wrong</h1>
    }

    const { assets } = data;

    if(assets.items.length === 0) {
        return <h1 className="text-white">No Mails Found...</h1>
    }
    
    return (
        <div style={{ maxHeight: '1000px', overflowY: 'auto' }} className="">
            {assets.items.map((item: any, index: number) => (
                <a href={`/mail/${item.id}`}>
                <div
                    key={index}
                    className="border-b p-2 text-white cursor-pointer hover:bg-gray-700"
                >
                    <div className="text-lg font-bold">{item.content.metadata.name}</div>
                    <div className="text-gray-200 truncate">
                        {item.content.metadata.description
                            ? item.content.metadata.description
                            : <i className="text-gray-500">No Content</i>}
                    </div>
                </div>
                </a>
            ))}
        </div>
    );
}

export default MailListView;
