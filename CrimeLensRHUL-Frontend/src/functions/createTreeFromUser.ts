export default async function createTreeFromUser(
  userId: string | undefined
): Promise<void> {
  console.log("Current User UID Tree: ", userId);
  if (!userId) {
    console.log("No user ID provided");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:23232/api/get-trees?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("Tree created");
    console.log(data);
    return data.treeCount;
  } catch (error: any) {
    console.error(error.message);
  }
}
