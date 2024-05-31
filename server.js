const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const { mergePdfs } = require("./merge");

const upload = multer({ dest: "uploads/" });
app.use("/static", express.static("public"));
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "templates/index.html"));
});

app.post("/merge", upload.array("pdfs", 2), async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).send("Please upload at least two PDF files");
    }

    console.log(req.files);
    let mergedFileName = await mergePdfs(
      path.resolve(__dirname, req.files[0].path),
      path.resolve(__dirname, req.files[1].path)
    );
    
    // Assuming mergePdfs returns the filename without the extension
    res.redirect(`http://localhost:3000/static/${mergedFileName}.pdf`);
  } catch (error) {
    console.error("Error during PDF merging:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
