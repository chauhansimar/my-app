const BASE_URL = "http://localhost:5000";

export const sendMessage = async (message) => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
};

export const addWebsite = async (url) => {
  const res = await fetch(`${BASE_URL}/api/scrape/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, companyId: "123" }),
  });

  return res.json();
};