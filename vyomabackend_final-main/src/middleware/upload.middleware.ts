import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",

  endpoint: `https://${process.env.ENDPOINT}`,

  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
});

const upload = multer({
  storage: multerS3({
    s3,

    bucket: process.env.BUCKET_NAME!,

    acl: "public-read",

    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export default upload;