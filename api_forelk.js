import { sendDataToElk } from "@/database/sendDataToElk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { id, data, indexName } = req.body;

  try {
    // Call the sendDataToElk function here
    await sendDataToElk(id, data, indexName);

    res.status(200).json({ message: "Data sent to Elasticsearch successfully" });
  } catch (error) {
    console.error("Error sending data to Elasticsearch:", error);
    res.status(500).json({ message: "Error sending data to Elasticsearch" });
  }
}
