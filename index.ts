import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import path from 'path';
import multer from 'multer';

const app: Express = express();
config();

// Enabel CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// URL-encoded data will be parsed with the querystring library.
// Parses the JSON string in the request body and exposes it in the req.body property
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    '/public',
    express.static(path.join(__dirname, 'public'), {
        setHeaders: (res, filePath) => {
            if (path.extname(filePath) === '.css') {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    })
);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/index.html')
});

// Multer is a node.js middleware for handling multipart/form-data, which is primarily used
//  for uploading files. It is written on top of busboy for maximum efficiency.
const upload = multer({ dest: 'uploads/' })
app.post('/api/fileanalyse', upload.single('upfile'), async (req: Request, res: Response) => {
    try {
        const { originalname, mimetype, size } = req?.file ?? {};
        res.json({
            "name": originalname,
            "type": mimetype,
            "size": size
        });
    } catch (err) {
        console.error(err);
        res.send(500).json('Error /api/fileanalyse');
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Your app is listening on port ${process?.env?.PORT || 3000}`);
});