import { promises as Fs } from 'fs';

import home_page from './src/page-home.mjs';
import paginated_index from './src/page-paginated.mjs';
import * as Utils from './src/utils.mjs';

export const BASE = "/home/rai/interim/eisel/public/";
export const MAX_LEN = 300; // For description


//run: ../make.sh eisel -l -f
// run:setsid falkon test.html

const config = Utils.process_args();
const ITEMS_PER_PAGE = 20;

// Allow Node to handle error (just exit)

try {
  await Fs.mkdir([config.write_path, "/", "video"].join(""))
} catch (err) {
  switch (err.code) {
    case "EEXIST": break; // It is okay if folder already exists
    default:
      console.log(err.code);
      process.exit(1)
  }
}

// Currently, assumes that this will be in the project home directory
const json_string = await Fs.readFile(config.json_path, "UTF8");
const video_list = JSON.parse(json_string);
Utils.validate_json_or_fail(video_list);



const video_count = video_list.length;
const page_count = Math.max(video_count / ITEMS_PER_PAGE);
const results = new Array(page_count);
for (let i = 0; i < page_count; ++i) {
  const start = i * ITEMS_PER_PAGE;
  const close = Math.min(start + ITEMS_PER_PAGE, video_count);

  results[i] = Utils.write(
    `${config.write_path}/${i + 1}.html`,
    paginated_index(config, `${i + 1}.html`, i, video_list, start, close),
    config.is_force,
  );
}
// Allow Node to handle error (just exit)
await Promise.all(results);

// Allow Node to handle error (just exit)
await Utils.write(
  `${config.write_path}/index.html`,
  home_page(config, "index.html"),
  config.is_force,
);


//const chunk_size = 100;
//const chunk_count = Math.max(video_count / chunk_size);
//let index = 0;
//for (let i = 0; i < chunk_count; ++i) {
//  const results = new Array(chunk_size);
//  for (let j = 0; j < chunk_size && index < video_count; ++j) {
//    const video_data = db[index];
//    results[j] = write(`../public/video/${video_data.id}.html`,
//      Pages.individual_video_page(`video/${video_data.id}.html`, video_data),
//      FORCE,
//    );
//    index += 1;
//  }
//  await Promise.all(results);
//}
