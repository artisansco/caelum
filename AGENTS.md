# Agent Guidelines for Caelum

## Build/Lint/Test Commands

- **Build**: `vite build`
- **Dev server**: `vite dev`
- **Tests**: No test framework implemented yet
- **Database**: `db:push`, `db:migrate`, `db:generate`, `db:seed`

## Code Style Guidelines

### Naming Conventions

- **Types**: PascalCase (`CurrentUser`, `Staff`, `Student`)
- **Variables/props**: snake_case (`btn_txt`, `trigger_class`)
- **Database fields**: snake_case (`first_name`, `school_id`)
- **Functions**: snake_case (`get_all_students`, `add_student`)

### Imports

- Use `$lib/` for internal imports
- Organize imports automatically (Biome assist enabled)

### Types & Validation

- **TypeScript**: Strict typing required
- **Optional fields**: Use `?` (e.g., `middle_name?: string`)
- **Date fields**: `string | Date`
- **Enums**: Union types from constants (e.g., `(typeof cities)[number]`)
- **Validation**: Zod schemas with custom error messages
- **Enum validation**: `.enum()` for predefined values
- **Email validation**: `.email()` for email addresses

### Error Handling

- **Database operations**: try/catch blocks
- **Logging**: `console.error()` for errors
- **HTTP errors**: SvelteKit `error()` function

### Database

- **ORM**: Drizzle ORM
- **Queries**: Use `db.select()`, `db.insert()`, `db.update()`, `db.delete()`
- **Joins**: `leftJoin()`, `innerJoin()` as needed

### File Structure

- **Components**: `src/lib/components/` (`.svelte` files)
- **Types**: `src/lib/types.ts`
- **Schemas**: `src/lib/schemas.ts` (Zod validation)
- **Database**: `src/lib/db/` (schema, seed, etc.)
- **Routes**: `src/routes/` (SvelteKit file-based routing)
- **Remote functions**: `.remote.ts` files for server actions

### Security

- Never commit secrets or keys
- Validate all inputs with Zod/valibot schemas
- Ask questions when you are unsure about something

## Svelte Development

### MCP Tools Available

You have access to comprehensive Svelte 5 and SvelteKit documentation through the Svelte MCP server. Use these tools effectively:

#### 1. list-sections

- Use this FIRST to discover all available documentation sections
- Returns structured list with titles, use_cases, and paths
- ALWAYS use when asked about Svelte or SvelteKit topics

#### 2. get-documentation

- Retrieves full documentation content for specific sections
- Accepts single or multiple sections
- After calling list-sections, fetch ALL relevant documentation sections for the task

#### 3. svelte-autofixer

- Analyzes Svelte code and returns issues and suggestions
- MUST use whenever writing Svelte code before sending to user
- Keep calling until no issues or suggestions remain

## Documentation Resources

### llms.txt Documentation Sources

When working on this project, fetch and reference these documentation sources for comprehensive context:

- **Svelte**: `https://svelte.dev/llms.txt` - Core Svelte concepts, runes, reactivity, Routing, server-side rendering, forms, etc
- **Drizzle ORM**: `https://orm.drizzle.team/llms.txt` - Database queries, schema definition, migrations, etc
- **Valibot**: `https://valibot.dev/llms.txt` - Form validation, schema definition, etc
- **Zod**: `https://zod.dev/llms.txt` - Data validation, schema definition, etc
- **Tiptap**: `https://tiptap.dev/llms.txt` - Rich text editor, schema definition, etc

### Usage Guidelines

- **Fetch documentation proactively** when implementing new features
- **Reference specific sections** when working with unfamiliar libraries
