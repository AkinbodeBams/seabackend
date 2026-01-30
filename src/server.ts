import app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚢 Seafarer Wellness API running on ${PORT}`);
});
