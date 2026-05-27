module.exports = async function adsTxt(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed.\n");
    return;
  }
  const publisher = process.env.GOOGLE_ADSENSE_PUBLISHER_ID || "";
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.status(200).send(publisher ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n` : "# Set GOOGLE_ADSENSE_PUBLISHER_ID in Vercel.\n");
};
