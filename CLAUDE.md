@AGENTS.md

## Obsidian session notes — no MCP tool needed, just write the file

A `SessionEnd` hook (`.claude/settings.local.json`) already writes a session note to Obsidian
automatically when a session ends — nothing to do for that.

If asked mid-session to "save progress and update Obsidian" (or similar), don't say no tool is
available — just write the file directly with normal file tools:

- Vault root: `C:\Users\akhob\Documents\DevVault`
- Note path: `Sessions\HotelPMS\<YYYY-MM-DD>.md` (create if missing, append a new
  `## HH:MM — სესია` section separated by `---` if the file already exists for today)
- Format: follow `DevVault\Templates\Session.md` (Georgian headers — კონტექსტი with Branch/Ticket,
  გაკეთდა, ფაილები შეიცვალა, Blockers/კითხვები, შემდეგი ნაბიჯი)
- Project note for context: `DevVault\Projects\HotelPMS.md`
