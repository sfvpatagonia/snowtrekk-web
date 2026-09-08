Session-close protocol — Snowtrekk modular docs



There is a separate, git-versioned docs vault at C:\\snowtrekk-docs\\ (NOT inside this repo) containing 13 Modulo\_\*.md files, one per Snowtrekk product/domain area, plus 00\_INDEX\_Mapa\_Snowtrekk.md and HANDOFF\_MAESTRO\_SNOWTREKK\_v2.md. Each module follows this skeleton: a header with the module name, Estado (activo/carpeteado/bloqueado), Depende de, Bloquea a, Última sesión relevante, then sections for Decisiones clave, Deuda técnica abierta, and Pendiente inmediato.



At the end of any implementation session where you made real changes (code committed, bugs fixed, architecture decisions made — not for trivial one-line asks):



Identify which Modulo\_\*.md in C:\\snowtrekk-docs\\ corresponds to what you worked on. If unsure which module, list the filenames in that folder and infer from the names — do not guess blindly, ask Sergio if it's genuinely ambiguous between two modules.

Read that file, then update it directly using your file-edit tools:

Update Última sesión relevante to today's date.

Update Pendiente inmediato to reflect the actual next step (overwrite, don't append below old items unless they're still genuinely pending).

If you closed something listed under Deuda técnica abierta or Decisiones clave, move/rewrite it — don't leave stale pending items that are actually done.

Keep edits concise — this is a status document, not a session transcript. No more than a few lines per section.

Do NOT create a new Sesion\_DD\_MM\_YYYY.md file by default. Only create one if the session involved extensive debugging or a decision complex enough that the module's terse format would lose important detail (ask Sergio if unsure — he'll say "documentalo aparte" if he wants the long version).

After updating, tell Sergio in your final response, in Spanish, one line: which module you updated and what changed — so he can decide whether to also sync that change to Project Knowledge in claude.ai (a separate manual step on his end, not yours).

Commit the docs vault change separately from the code commit: cd C:\\snowtrekk-docs \&\& git add . \&\& git commit -m "docs: update Modulo\_X after <short reason>". Do not mix this commit with the implementation repo's commits — they are different git repositories.



If C:\\snowtrekk-docs\\ doesn't exist or the relevant module file is missing, say so explicitly instead of silently skipping this step.

