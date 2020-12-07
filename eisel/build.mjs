import { promises as Fs } from 'fs';

import home_page from './src/page-home.mjs';
import full_index from './src/page-full-index.mjs';
import paginated_index from './src/page-paginated.mjs';
import video_page from './src/page-video-page.mjs';
import * as Utils from './src/utils.mjs';

export const BASE = "/home/rai/interim/eisel/public/";
export const MAX_LEN = 300; // For description


//run: ../make.sh eisel -l
// run:setsid falkon test.html

const config = Utils.process_args();
const ITEMS_PER_PAGE = 50;

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
const page_count = Math.ceil(video_count / ITEMS_PER_PAGE);
const sitemap_count = video_list.length + page_count + 4;
const sitemap = new Array(sitemap_count);
let sitemap_index = -1;

// The paginated list
await async function () {
  const results = new Array(page_count);
  for (let i = 0; i < page_count; ++i) {
    const start = i * ITEMS_PER_PAGE;
    const close = Math.min(start + ITEMS_PER_PAGE, video_count);
    const url = `${config.domain}/${i + 1}.html`

    results[i] = Utils.write(
      `${config.write_path}/${i + 1}.html`,
      paginated_index(config, url, i, video_list, start, close),
      config.is_force,
    );
    sitemap[++sitemap_index] = {
      loc: url,
      changefreq: 'daily',
    };
  }
  // Allow Node to handle error (just exit)
  await Promise.all(results);
}();


await async function () {
  // The list dump
  const url = `${config.domain}/list.html`;
  await Utils.write(
    `${config.write_path}/list.html`,
    full_index(config, url, "One-Page Video List", video_list),
    true,
  );
  sitemap[++sitemap_index] = {
    loc: url,
    changefreq: 'monthly',
  };
}();

// The individual video pages
await async function () {
  const chunk_size = 100;
  const chunk_count = Math.max(video_count / chunk_size);
  let index = 0;
  for (let i = 0; i < chunk_count; ++i) {
    const results = new Array(chunk_size);
    for (let j = 0; j < chunk_size && index < video_count; ++j) {
      const video_data = video_list[index];
      const url = `${config.domain}/video/${video_data.id}.html`;

      results[j] = Utils.write(
        `${config.write_path}/video/${video_data.id}.html`,
        video_page(config, url, video_data),
        config.is_force,
      );
      index += 1;

      sitemap[++sitemap_index] = {
        loc: url,
        changefreq: 'monthly',
      };
    }
    await Promise.all(results);
  }
}();

// All the single pages
await async function () {
  const url = `${config.domain}/`
  // Allow Node to handle error (just exit)
  await Utils.write(
    `${config.write_path}/index.html`,
    home_page(config, url),
    config.is_force,
  );
  sitemap[++sitemap_index] = {
    loc: url,
    changefreq: 'monthly',
  };

}();

// The sitemap
await async function() {
  const rendered_sitemap = new Array(sitemap_index + 1);
  for (let i = 0; i <= sitemap_index; ++i) {
    const x = sitemap[i];
    rendered_sitemap[i] = `
<url>
  <loc>${x.loc}</loc>
  <changefreq>${x.changefreq}</changefreq>
</url>`;
  }
  const sitemap_string =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${rendered_sitemap.join("\n")}
</urlset>
`;
  await Utils.write(`${config.write_path}/sitemap.xml`, sitemap_string, true);
}();

console.log(`
Sitemap precalculated count: ${sitemap_count}
Sitemap Index:               ${sitemap_index}`
);
