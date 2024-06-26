import UsersList from "./components/UsersList";

async function fetchData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
    next: { revalidate: 20 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function UsersPage() {
  let initialData;
  try {
    initialData = await fetchData();
  } catch (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load: {error.message}
      </div>
    );
  }

  return <UsersList initialData={initialData} />;
}
