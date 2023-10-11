// YourComponent.js

import { useMailApi } from "@/hooks/useMailApi";

function MailListView() {

  const { data, loading, error } = useMailApi("/api/mail");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render your component with the fetched data
  return (
    <div className="text-white">
      <h1>Data from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MailListView;
