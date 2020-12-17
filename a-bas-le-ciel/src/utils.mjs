import {promises as Fs} from 'fs';

const VALID_KEYS = ["id", "url", "upload_date", "title", "description", "thumbnail"];
const VALID_LENGTH = VALID_KEYS.length;

//run: ../../make.sh eisel -l -f

// Last I did javascript, according to John-David Dalton (lodash),
// vanilla '.map()' is slower than a for loop ('.map()' has to deal with
// sparse arrays) and generally the fastest way to push elements onto an
// array is with a for loop with indexing (i.e. `array[i]`)
export function process_args() {
  const length = process.argv.length;
  const args = new Array(length);
  let is_force = false;
  let push_index = 0;

  // Skip first two arguments: 'node  $0'
  for (let i = 2; i < length; ++i) {
    const entry = process.argv[i];
    switch (entry) {
      case "-f":
      case "--force":
        is_force = true;
        break;

      default:
        args[push_index] = entry;
        ++push_index;
        break;
    }
  }
  if (push_index != 5) {
    console.log(
`Expected three arguments:
  node '${process.argv[1]}' <video-json-path> <playlist-json-path> <path-to-write-folder> <public-path-for-links>

Received:`,
      process.argv
    );
    process.exit(1);
  }
  return {
    is_force,
    videolist_path: args[0],
    playlist_path: args[1],
    write_path: args[2],
    domain: args[3],
    transcript_dir: args[4],
  };

}

export function validate_json_or_fail(json_array) {
  const len = json_array.length;
  for (let i = 0; i < len; ++i) {
    const entry = json_array[i];
    if (!(check_is_valid_in_attribute(entry.id)
      && check_is_valid_in_attribute(entry.url)
      && check_is_valid_outside_tags(entry.upload_date)
      && check_is_valid_outside_tags(entry.title)
      && check_is_valid_outside_tags(entry.description)
      && check_is_valid_outside_tags(entry.thumbnail)
    )) {
      console.log("Entry contains invalid characters \" & ' < >", entry);
      process.exit(1)
    }

    const keys = Object.keys(entry);
    if (keys.length !== VALID_LENGTH) {
      console.log("Entry contains too many/little keys", entry);
      process.exit(1);
    }
    for (const key of VALID_KEYS) {
      if (VALID_KEYS.indexOf(key) === -1) {
        console.log(`Entry does not contain the key '${key}'`, entry);
        process.exit(1);
      }
    }
  }
}

function check_is_valid_in_attribute(val) {
  const str_length = val.length;
  for (let j = 0; j < str_length; ++j) {
    switch (val.charCodeAt(0)) {
      case 34: // " '&quot;'
      case 38: // & '&amp;'
      case 39: // ' '&#39;'
      case 60: // < '&lt;'
      case 62: // > '&gt;'
        return false;
    }
  }
  return true;

}
function check_is_valid_outside_tags(val) {
  const str_length = val.length;
  for (let j = 0; j < str_length; ++j) {
    switch (val.charCodeAt(0)) {
      //case 34: // " '&quot;'
      case 38: // & '&amp;'
      //case 39: // ' '&#39;'
      case 60: // < '&lt;'
      case 62: // > '&gt;'
        return false;
    }
  }
  return true;
}

export function write(path, promise, force) {
  return force
    ? promise.then(content => Fs.writeFile(path, content, "UTF8"))
    : Fs.access(path)
      .catch(_ => promise
        .then(content => Fs.writeFile(path, content, "UTF8"))
        // Only log this write if NOT --force and 'path' was missing
        .then(_ => console.log(`Wrote to ${path}`)))
  // Allow you the node to handle the error for use
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

