# Importing bricks

In the Payload admin, open **Bricks**, choose an `.xlsx` file under **Import brick spreadsheet**, and click **Import bricks**.

- Name the worksheets **North West** and **North East**. One or both sheets may be included.
- Put numbered column headers (1–50) in the first row, starting in cell B1.
- Put row letters (A–N) in the first column, starting in cell A2.
- Put each name or inscription in its corresponding grid cell. Blank cells are skipped.
- Files must be no larger than 5 MB. Formulas, merged inscriptions, and invalid locations are rejected before any bricks are saved.

The import reports created and updated counts for unique locations. Bricks are matched by **panel, row, and column**. If a location exists, its inscription is updated while preserving its ID and creation date. Otherwise, a new brick is created. Identical names at different locations are allowed. Repeated locations within a workbook use the last nonblank inscription. Blank cells do not clear or delete existing bricks. Reimporting an unchanged workbook counts matching locations as updated.

The authenticated endpoint is `POST /api/bricks/import`, with a multipart form field named `file`. A compound unique database index protects locations, including simultaneous uploads. A single database statement saves the import atomically.

## Verification

Run `npm run test:bricks` for parser and endpoint tests. To also run the PostgreSQL test, use:

```sh
node --env-file=.env --import tsx --test tests/bricks-import.test.ts
```

The PostgreSQL test uses a session-local temporary table and does not change the real brick records. The collection's compound index must be applied with the project's normal schema deployment process in production; development schema push applies it automatically.
