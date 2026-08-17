# Quora archive

Copy-edited posts from erased Quora accounts land here, one file per post, imported from the
private `chargingthefuture/quora` repo once copy-editing of each export is finished.

Import rules:

- Only the author's own words plus the question title and question URL cross into this public
  collection. Other people's comments and answers stay in the private repo.
- Front matter follows the schema in `content/README.md`, with an `archive` block:
  `source: "quora"`, `account`, `original_url`, `original_date`, `status: "erased"`.
- `date` is the original posting date, so the archive orders by when things were written.
- One subdirectory per account (e.g. `pedigree101/`).

The raw exports and their commit history remain in the private repo as the evidentiary record.
