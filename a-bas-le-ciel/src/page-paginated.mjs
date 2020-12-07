import  *  as Headers from './headers.mjs';

//run: ../../make.sh eisel -l -f

export default function paginated_index(
  config, rel_path, index, last_number, video_list, start, close
) {
  const length = video_list.length;
  const previous = (start <= 0)
    ? ''
    : ( `<a href="${config.domain}/1.html">&lt;&lt;</a>&nbsp;&nbsp;`
      + `<a href="${config.domain}/${index}.html">&lt; Previous Page</a>`
    );


  const next = (close >= length)
    ? ''
    : ( `<a href="${config.domain}/${index + 2}.html">Next Page &gt;</a>`
      + `&nbsp;&nbsp;<a href="${config.domain}/${last_number}.html">&gt;&gt;</a>`
    );


  return `<!DOCTYPE html>
<html>
<head>${
  Headers.head(`Video Index - Page ${index + 1}`)
}${css}
</head>
<body>${
  Headers.navbar(config, rel_path)}
  <main class="medium-column">
    <aside></aside>
    <section class="paginated-list">
      <div class="topleft">${previous}</div>
      <div class="topright">${next}</div>
      <ol class="list" start="${start + 1}">${
        paginated_index_main(config, video_list, start, close)}
      </ol>
      <div class="botleft">${previous}</div>
      <div class="botright">${next}</div>
    </section>
    <aside></aside>
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
        <h2 class="title"><a href="${config.domain}/video/${id}.html">${title}</a></h2>
        <p class="date">${Headers.format_date(upload_date)} <a href="${url}">[YT link]</a></p>
        <p class="description">${Headers.format_desc(description)}</p>
      </div></li>`;
  }
  return subarray.join("");
}

const css = `
  <style>
.paginated-list li {
  margin-top:    40px;
  /* list-style-position: outside; */
}
.paginated-list .topright, .botright {
  text-align: right;
}
.paginated-list > div {
  margin-top: 40px;
}

.paginated-list {
  display: grid;
  grid-template-areas:
    "topleft   topright"
    "list      list"
    "botleft   botright";
}
.paginated-list .topleft  { grid-area: topleft; }
.paginated-list .topright { grid-area: topright; }
.paginated-list .list     { grid-area: list; }
.paginated-list .botleft  { grid-area: botleft; }
.paginated-list .botright { grid-area: botright; }

.paginated-item .thumbnail   {
  width: 336px;
  margin-right: 10px;
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
.paginated-item .description {
  height: 100%;
  overflow-y: auto;
}


.paginated-item {
  display: grid;
  grid-template-areas:
    "thumbnail title"
    "thumbnail date"
    "thumbnail description";
  grid-template-rows: auto 2em 1fr;
  height: 188px;
}
.paginated-item .thumbnail   { grid-area: thumbnail; }
.paginated-item .title       { grid-area: title; }
.paginated-item .date        { grid-area: date; }
.paginated-item .description { grid-area: description; }

  </style>`
