const multer = require("multer");
const express = require("express");
const { Media } = require("../models");
const router = express.Router();
const {
  insertDocument,
  findDocument,
  updateDocument,
  insertDocuments,
} = require("../helper/MongoDBHelper");

const upload = require("../middlewares/fileMulter");
const UPLOAD_DIRECTORY = "./public/uploads";

router.post("/upload-single", (req, res, next) =>
  upload.single("upload1")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: "MulterError", err: err });
      } else if (err) {
        res.status(500).json({ type: "UnknownError", err: err });
      } else {
        // const response = await insertDocument({
        //     location: req.file.path,
        //     name: req.file.filename,
        //     employeeId: req.user_id,
        //     size: req.file.size,
        // }, 'Media',);
        const media = new Media({
          location: req.file.path,
          name: req.file.filename,
          employeeId: req.user._id,
          size: req.file.size,
        });
        const response = await media.save();
        res.status(200).json({ message: "Upload success", payload: response });
      }
    } catch (error) {
      console.log("Nguyenne error Nguyenne", error);
      res.status(500).json({ message: "Upload file error", error });
    }
  })
);

router.post("/upload-multiple", (req, res, next) =>
  upload.array("uploads", 3)(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: "MulterError", err: err });
      } else if (err) {
        res.status(500).json({ type: "UnknownError", err: err });
      } else {
        const dataInsert = req.files.reduce((pre, file) => {
          pre.push({
            name: file.filename,
            location: file.path,
            size: file.size,
            employeeId: req.user._id,
          });
          return pre;
        }, []);

        const response = await insertDocuments(dataInsert, "Media");
        res.status(200).json({ message: "Upload success", payload: response });
      }
    } catch (error) {
      console.log("Nguyenne error Nguyenne", error);
      res.status(500).json({ message: "Upload file error", error });
    }
  })
);

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const payload = await Media.findById(id);

  if (payload) return res.status(200).json({ payload });

  return res.status(400).json({ message: "Không tìm thấy" });
});

router.post("/media/update/:id", async (req, res, next) => {
  const { id } = req.params;
  const found = await findDocument(id, "Media");
  if (!found)
    res
      .status(410)
      .json({ message: `${collectionName} with id ${id} not found` });

  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: "MulterError", err: err });
      } else if (err) {
        res.status(500).json({ type: "UnknownError", err: err });
      } else {
        const response = await updateDocument(
          { _id: id },
          {
            location: req.file.path,
            name: req.file.filename,
            employeeId: req.user._id,
            size: req.file.size,
          },
          "Media"
        );
        res.status(200).json({ ok: true, payload: response });
      }
    } catch (error) {
      res.status(500).json({ oke: false, error });
    }
  });
});

// router.patch("/media/delete/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await Media.findByIdAndUpdate(id, { new: true });
//     if (result) {
//       return res.send(200, {
//         message: "Delete success",
//         payload: result,
//       });
//     }
//     return res.send(400, {
//       message: "Thất bại",
//     });
//   } catch (error) {
//     return res.send(404, {
//       message: "Not Found",
//       error,
//     });
//   }
// });
// Assuming you already have the `upload` middleware configured and exported

// DELETE /files/:fieldname/:filename
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const media = await Media.findById(id);
//     if (!media) {
//       return res.status(404).json({
//         message: "Media not found",
//       });
//     }
//     const filePath = `${UPLOAD_DIRECTORY}/media/${file.fieldname}`;

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//     await Media.findByIdAndDelete(id);

//     return res.status(200).json({
//       message: "Delete success",
//       payload: media,
//     });
//   } catch (error) {
//     console.log("Nguyenne error Nguyenne", error);

//     return res.status(500).json({
//       message: "Internal server error",
//       error,
//     });
//   }
// });

module.exports = router;
