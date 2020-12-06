import  *  as Headers from './headers.mjs';

export default function paginated_index(config, rel_path, index, video_list, start, close) {
  const length = video_list.length;
  const previous = (start <= 0)
    ? ''
    : `<a href="${config.domain}/${index}.html">&lt; Previous Page</a>`;

  const next = (close >= length)
    ? ''
    : `<a href="${config.domain}/${index + 2}.html">Next Page &gt;</a>`;


  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head(`Video Index - Page ${index + 1}`)
}${css}
</head>
<body>${
  Headers.navbar(config, rel_path)}
  <main class="paginated-list">
    <div class="left">${previous}</div>
    <div class="right">${next}</div>
    <ol start="${start + 1}">${
      paginated_index_main(config, video_list, start, close)}
    </ol>
    <div>${previous}</div>
    <div>${next}</div>
  </main>
</body>
</html>`;
}

function paginated_index_main(config, video_list, start, close) {
  const length = close - start;
  const subarray = new Array(length);
  for (let i = 0; i < length; ++i) {
    const { id, url, title, upload_date, description, thumbnail } = video_list[start + i];
    subarray[i] = `
      <li><div class="paginated-item">
        <img class="thumbnail" src="${thumbnail.url}" width="100%">
        <h1 class="title"><a href="${config.domain}/video/${id}.html">${title}</a></h1>
        <p class="date">${Headers.format_date(upload_date)}</p>
        <p class="description">${Headers.format_desc(description)}</p>
      </div></li>`;
  }
  return subarray.join("");
}

const css = `
  <style>
/* .paginated-list li { list-style-position: outside; }
*/

.paginated-item {
  display: grid;
  grid-template-areas:
    "left      right"
    "thumbnail title"
    "thumbnail date"
    "thumbnail description";
  grid-template-rows: 1em auto 1.8em 1fr;
  height: 188px;
  margin: 40px 0px;
}
.paginated-item .thumbnail   {
  width: 336px;
}
.paginated-item * {
  border: 0px;
  padding: 0px;
  margin: 0px;
}
.paginated-item .title       {
  overflow-x: hidden;
  white-space: nowrap;
}
.paginated-item .description { overflow-y: auto; }

.paginated-item .left        { grid-area: left; }
.paginated-item .right       { grid-area: right; }
.paginated-item .thumbnail   { grid-area: thumbnail; }
.paginated-item .title       { grid-area: title; }
.paginated-item .date        { grid-area: date; }
.paginated-item .description { grid-area: description; }

  </style>`
