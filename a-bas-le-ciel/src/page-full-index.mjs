import  *  as Headers from './headers.mjs';
import { MAX_LEN } from '../build.mjs';

//run: ../../make.sh eisel -l

export default function full_index(config, rel_path, title, video_list) {
  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head(title)}
</head>
<style>
  main li {
    /* else there is not enough space for four digits */
    /* top right bottom left */
    margin: 0em 2em 2em 2em;
  }
  .description {
    height: 10em;
    overflow-y: auto;
  }
</style>
<body>${
  Headers.navbar(config, rel_path)}
  <main class="thin-column">
    <aside></aside>
    <section>
      <ol>${
function () {
  return video_list.map(({ id, url, title, upload_date, description}) => {
    return `
<li>
  <h2><a href="${config.domain}/video/${id}.html">${title}</a></h2>
  <p>${Headers.format_date(upload_date)} <a href="${url}">[YT link]</a></p>
  <p class="description">${
    Headers.format_desc(description)
    //Headers.format_desc(Headers.ellipt(description, MAX_LEN))
}</p>
</li>`;
  }).join("");
}()}
      </ol>
    </section>
    <aside></aside>
  </main>
</body>
</html>`;
}
        //<p>${}</p>
