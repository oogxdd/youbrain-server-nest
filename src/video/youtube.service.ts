// import { promisify } from "util";
// import { pipeline } from "stream";
// import { createWriteStream } from "fs";
// import path from "path";
// import fs from "fs";
// import ytdl from "@distube/ytdl-core";
// import { cookies } from "#config/youtube-cookie.js";
// import fsAsync from "fs/promises"; // Import the promise-based version of fs

// const pipelineAsync = promisify(pipeline);

// const agent = ytdl.createAgent(cookies);

// export const downloadVideo = async (youtubeId, format) => {
//   const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
//   const downloadDir = path.resolve(process.cwd(), "downloads");
//   const videoPath = path.join(downloadDir, `${youtubeId}.${format.container}`);

//   // Ensure the downloads directory exists
//   if (!fs.existsSync(downloadDir)) {
//     fs.mkdirSync(downloadDir, { recursive: true });
//   }

//   try {
//     await pipelineAsync(
//       ytdl(videoUrl, {
//         agent,
//         format: format,
//       }),
//       createWriteStream(videoPath)
//     );

//     console.log(
//       `Downloaded video: ${videoPath} (Format: ${
//         format.qualityLabel || format
//       })`
//     );

//     return videoPath;
//   } catch (error) {
//     console.error("Error downloading video:", error);
//     throw error;
//   }
// };

// export const getVideoInfo = async (youtubeId) => {
//   console.log("init");
//   const info = await ytdl.getInfo(youtubeId, {
//     agent,
//   });

//   let format;
//   const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
//   const videoFormats = ytdl.filterFormats(info.formats, "videoonly");
//   if (audioFormats.length > 0) {
//     format = audioFormats[0];
//   } else {
//     format = videoFormats[0];
//   }

//   // Get the highest quality thumbnail
//   const thumbnail = info.videoDetails.thumbnails.reduce((prev, current) =>
//     prev.width > current.width ? prev : current
//   );

//   return {
//     title: info.videoDetails.title,
//     description: info.videoDetails.description,
//     format: format,
//     thumbnailUrl: thumbnail.url,
//     channelName: info.videoDetails.author.name,
//     channelId: info.videoDetails.channelId,
//   };
// };

// export const deleteVideo = async (filePath) => {
//   try {
//     await fsAsync.unlink(filePath);
//     console.log(`Successfully deleted ${filePath}`);
//   } catch (error) {
//     console.error(`Error deleting file ${filePath}:`, error);
//   }
// };

// export const extractYoutubeId = (url) => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   return match && match[2].length === 11 ? match[2] : null;
// };
