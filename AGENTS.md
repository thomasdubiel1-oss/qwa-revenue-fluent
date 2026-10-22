<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Demand Scout lives under `/internal/demand-scout` with separate ingestion, scoring, matching, drafting, and outcome modules; this keeps future providers independent of the QWA UI.
- Demand Scout’s anonymous demo contains only bundled synthetic fixtures in origin-local storage; authenticated workspace reads use existing account membership and RLS, never internal-admin bypass.
- Demand Scout tables use a `scout_` prefix and existing `tenants`/`accounts` membership, with composite tenant foreign keys to prevent cross-tenant linking.
