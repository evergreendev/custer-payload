Public help wanted submissions
=============================

- `/submit-help-wanted` accepts a title, optional image (JPEG, PNG, GIF, or WebP up to 30MB), description, HTTP(S) link, and link label.
- Submissions are saved as drafts in the **Help Wanted** collection. Anonymous API clients cannot create, update, or delete listings, and can read only published listings.
- A review notification goes to the same recipient as public event submissions, configured in `src/utilities/submissionNotifications.ts`. The email links directly to the submitted draft in the admin panel.
- Staff review the draft under **Help Wanted** and select **Publish** to approve it. Published listings appear at `/help-wanted`, which also links to the submission form. Unpublishing or deleting a listing removes it from the public page.
- Email failures are logged with the saved listing ID. The draft stays available for review without requiring the visitor to resubmit.

Apply the new collection and draft/version tables through the project's normal PostgreSQL schema deployment process before serving this change in production. Development schema push applies the collection automatically. No production database changes are performed by the type generator or unit tests.

Run the submission and access tests with `node --import tsx --test tests/help-wanted.test.ts`.
