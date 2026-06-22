async function testMentorSubjectsCols() {
  console.log("Querying all columns from mentor_subjects...");
  try {
    const res = await fetch("http://localhost:5000/api/db/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        table: "mentor_subjects",
        method: "select",
        columns: "*",
        filters: []
      })
    });
    
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response data sample:", JSON.stringify(json.data?.[0], null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testMentorSubjectsCols();
