import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs-extra";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from 'path';

// Remove this import
// import { analyzePEFile } from './services/peAnalyzer.js';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import incidentRoutes from './routes/incidents.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDb is connected");
    })
    .catch((err) => {
        console.log(err);
    });


const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({ origin: "*" }));
app.use(cookieParser());


const upload = multer({ dest: "uploads/" });
// const upload = multer({ dest: '/tmp/' }); // Use `/tmp/` for Vercel functions
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/files/";

// Function to calculate SHA-256 hash
const calculateFileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);

        stream.on("data", (data) => hash.update(data));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
};

// Query VirusTotal API
const queryVirusTotal = async (fileHash) => {
    try {
        const response = await axios.get(`${VIRUSTOTAL_API_URL}${fileHash}`, {
            headers: { "x-apikey": VIRUSTOTAL_API_KEY },
        });
        return response.data;
    } catch (error) {
        return { error: "Error querying VirusTotal API" };
    }
};

// Upload file and scan it
app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileHash = await calculateFileHash(filePath);
    
    let analysisResults = {
        virusTotal: null,
        // Remove peAnalysis
    };

    // Perform VirusTotal analysis
    const vtResponse = await queryVirusTotal(fileHash);
    if (!vtResponse.error) {
        const attributes = vtResponse.data?.attributes || {};
        const results = attributes.last_analysis_results || {};
        analysisResults.virusTotal = {
            name: attributes.meaningful_name || "Unknown",
            hash_sha256: attributes.sha256 || fileHash,
            description: attributes.type_description || "Unknown",
            size: `${(attributes.size || 0) / 1000} KB`,
            antivirusResults: Object.entries(results).map(
                ([engine, result]) => ({
                    engine,
                    verdict: result.category === "malicious" ? "Malicious" : result.category,
                })
            )
        };
    }

    // Perform PE analysis if file is an executable
    // Remove PE analysis section
    // if (req.file.mimetype === 'application/x-msdownload' || 
    //     req.file.originalname.endsWith('.exe') || 
    //     req.file.originalname.endsWith('.dll')) {
    //     try {
    //         analysisResults.peAnalysis = await analyzePEFile(filePath);
    //     } catch (error) {
    //         console.error('PE analysis failed:', error);
    //         analysisResults.peAnalysis = { error: error.message };
    //     }
    // }

    // Clean up the uploaded file
    fs.remove(filePath);

    return res.json(analysisResults);
});

// Add a dedicated PE analysis endpoint
// Remove the entire PE analysis endpoint
// app.post("/api/analyze-pe", upload.single("file"), async (req, res) => {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//
//     const filePath = req.file.path;
//     
//     try {
//         if (req.file.mimetype === 'application/x-msdownload' || 
//             req.file.originalname.endsWith('.exe') || 
//             req.file.originalname.endsWith('.dll')) {
//             
//             const peAnalysisResult = await analyzePEFile(filePath);
//             
//             fs.remove(filePath);
//             
//             return res.json({ success: true, data: peAnalysisResult });
//         } else {
//             fs.remove(filePath);
//             
//             return res.status(400).json({ 
//                 success: false, 
//                 error: "Unsupported file type. Please upload a Windows executable (.exe) or DLL (.dll) file." 
//             });
//         }
//     } catch (error) {
//         console.error('PE analysis failed:', error);
//         
//         fs.remove(filePath);
//         
//         return res.status(500).json({ 
//             success: false, 
//             error: `PE Analysis failed: ${error.message}` 
//         });
//     }
// });


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/incidents', incidentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start server
// const PORT = process.env.PORT || 5000;
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
