// YourComponent.js

import { Error } from "@/components/Error";
import { LoadingSection } from "@/components/LoadingSection";
import { MediaObject } from "@/components/MediaObject";
import { Button } from "@/components/Button";
import { useMailApi } from "@/hooks/useMailApi";
import { useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { formatTimestamp } from "@/lib/utils";

function MailListView() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useMailApi(
    `/api/mail?page=${page}&limit=50`
  );
  console.log(data);

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    <Error error={error} />;
  }

  if (!data?.items) return null;

  const { items } = data;

  if (!items || items.length === 0) {
    return (
        <div className="h-max-96 overflow-y-auto">
            {items.map((item: any, index: number) => (
                <a key={index} href={`/mail/${item.id}`} target="_blank">
                <div key={index} className="border-b border-dark-accent p-2 text-white cursor-pointer hover:bg-gray-700">
                    <MediaObject
                        title={item.content.metadata.name}
                        description={item.content.metadata.description}
                        className="text-gray-200 truncate"
                    />
                    <div className="flex justify-end items-end">
                        <div className="text-gray-500">
                        {`${formatTimestamp(item!.content!.metadata!.attributes![1].value)}`}
                        </div>
                    </div>
                </div>
                </a>

                // <a key={index} href={`/mail/${item.id}`} target="_blank">
                //     <div
                //         className="border-b border-dark-accent p-2 text-white cursor-pointer hover:bg-gray-700"
                //     >
                //         <MediaObject
                //             title={item.content.metadata.name}
                //             description={item.content.metadata.description}
                //             className="text-gray-200 truncate"
                //         />
                //     </div>
                // </a>
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

        {/* Prev, Next Buttons */}
        <div className="flex items-end justify-end mt-4">
          <Button
            type="secondary"
            className="mr-2"
            onClick={() => {
              if (page > 1) setPage((prevPage) => prevPage - 1);
            }}
          >
            Prev
          </Button>
          <Button
            type="secondary"
            onClick={() => {
              if (data.items.length > 0) setPage((prevPage) => prevPage + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-max-96 overflow-y-auto">
      {items.map((item: any, index: number) => (
        <a key={index} href={`/mail/${item.id}`} target="_blank">
          <div className="border-b border-dark-accent p-2 text-white cursor-pointer hover:bg-gray-700">
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
        <Button
          type="secondary"
          className="mr-2"
          onClick={() => {
            if (page > 1) setPage((prevPage) => prevPage - 1);
          }}
        >
          Prev
        </Button>
        <Button
          type="secondary"
          onClick={() => {
            if (items.length > 0) setPage((prevPage) => prevPage + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default MailListView;
