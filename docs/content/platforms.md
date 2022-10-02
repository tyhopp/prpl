<!--
title: Platforms
description: Platform support and APIs used by PRPL, a modular static site generator built for longevity.
slug: /platforms
order: 07
-->

# Platforms

PRPL supports [Node](https://nodejs.org/en/) [current and LTS versions](https://nodejs.org/en/about/releases/). Support for [Deno](https://deno.land) is on the [roadmap](/roadmap#deno-support).

## Node

Here is a breakdown of all Node platform APIs used by PRPL and their earliest supported versions:

### [`os`](https://nodejs.org/api/os.html)

| Method                                        | Version supported |
| --------------------------------------------- | ----------------- |
| [`EOL`](https://nodejs.org/api/os.html#oseol) | >=0.7.8           |

### [`url`](https://nodejs.org/api/url.html)

| Method                                                                 | Version supported |
| ---------------------------------------------------------------------- | ----------------- |
| [`fileURLToPath`](https://nodejs.org/api/url.html#urlfileurltopathurl) | >=10.12.0         |

### [`path`](https://nodejs.org/api/path.html)

| Method                                                                     | Version supported |
| -------------------------------------------------------------------------- | ----------------- |
| [`basename`](https://nodejs.org/api/path.html#path_path_basename_path_ext) | >=0.1.25          |
| [`dirname`](https://nodejs.org/api/path.html#path_path_dirname_path)       | >=0.1.16          |
| [`extname`](https://nodejs.org/api/path.html#path_path_extname_path)       | >=0.1.25          |
| [`join`](https://nodejs.org/api/path.html#path_path_join_paths)            | >=0.1.16          |
| [`parse`](https://nodejs.org/api/path.html#path_path_parse_path)           | >=0.11.15         |
| [`posix`](https://nodejs.org/api/path.html#pathposix)                      | >=0.11.15         |
| [`relative`](https://nodejs.org/api/path.html#path_path_relative_from_to)  | >=0.5.0           |
| [`resolve`](https://nodejs.org/api/path.html#path_path_resolve_paths)      | >=0.3.4           |
| [`sep`](https://nodejs.org/api/path.html#pathsep)                          | >=0.7.9           |

### [`fs/promises`](https://nodejs.org/api/fs.html#fs_promises_api)

| Method                                                                                  | Version supported |
| --------------------------------------------------------------------------------------- | ----------------- |
| [`copyFile`](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)       | >=10.0.0          |
| [`mkdir`](https://nodejs.org/api/fs.html#fs_fspromises_mkdir_path_options)              | >=10.0.0          |
| [`readdir`](https://nodejs.org/api/fs.html#fs_fspromises_readdir_path_options)          | >=10.0.0          |
| [`readFile`](https://nodejs.org/api/fs.html#fs_fspromises_readfile_path_options)        | >=10.0.0          |
| [`stat`](https://nodejs.org/api/fs.html#fs_fspromises_stat_path_options)                | >=10.0.0          |
| [`writeFile`](https://nodejs.org/api/fs.html#fs_fspromises_writefile_file_data_options) | >=10.0.0          |

## Deno

Deno has been a consideration since early days in the PRPL project. The following decisions were partly influenced by
the potential for Deno as platform target:

- Adoption of TypeScript
- PRPL modules written as ECMAScript modules
- Introduction of `ensureDir`, `ensureFile`, and `exists` as library functions

These decisions will ease the process of supporting Deno. Some other notes:

- There is an [open ticket on Node compatibility](https://github.com/denoland/deno/issues/2644_) and an [effort in the Deno standard lib working towards it](https://deno.land/std@0.105.0/node)
- The Deno standard library has a [`path`](https://deno.land/std@0.105.0/path) module that has 1:1 implementations
  with all `path` Node APIs used by PRPL
- Deno `fs` to Node `fs/promises` is less exact in equivalency for the APIs used by PRPL but is fairly close

---

See the [FAQ](/faq) next.
