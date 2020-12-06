//run: node index.mjs

export function head(title) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${title}</title>
  <style>
    body { margin: 0px; padding: 0px; border: 0px; }
    span, div, p, h1, h2, h3, h4, h5, h6 { line-height: 1.3em; }
    nav {
      /* display: fixed; */
    }
    nav span {
       display: inline-block;
       padding: 10px 20px;
       text-align: center;
       vertical-align: center;
    }
    nav .search {
      float: right;
    }
  </style>`
};


export function navbar(config, rel_path) {
  return `
  <nav><!--
    --><span>${format_nav_link(config, "Home", rel_path, "")}</a></span><!--
    --><span>${format_nav_link(config, "Paginated", rel_path, "1.html")}</a></span><!--
    --><span>${format_nav_link(config, "Full List", rel_path, "list.html")}</a></span><!--
    --><span class="search">
      <form  action="https://google.com/" method="get">
        <input type="text" name="q" autocomplete="off">
        <input type="submit" value="WIP Search">
      </form>
    </span>
  </nav>`
};
function format_nav_link(config, title, rel_path, target) {
  //console.log(`${config.domain}, ${title}, ${rel_path}, ${target}`);
  return rel_path == target
    ? `${title}`
    : `<a href="${config.domain}/${target}">${title}</a>`
  ;
}


// https://stackoverflow.com/questions/3809401/
export function format_desc(text) {
  return text.split("\n").join("<br><br>")
    .replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
      match => `<a href="${match}">${match}</a>`);
  ;
};

export function ellipt(text, max_len) {
  return text.length > max_len
    ? text.substring(0, max_len - 3) + "..."
    : text;
};

export function format_date(date) {
  const year = date.substring(0, 4);
  const month = parseInt(date.substring(4, 6)) - 1;
  const day = date.substring(6, 8);
  const to_month_name = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${to_month_name[month]} ${day}, ${year}`;
};

