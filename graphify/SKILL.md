---
name: graphify
description: Use for codebase questions, architecture, file relationships. Turns code/docs/media into queryable knowledge graph.
---
# /graphify

Turn any folder into navigable knowledge graph with interactive HTML, JSON, and GRAPH_REPORT.md.

## Common Usage
```bash
/graphify .                           # current directory
/graphify <path>                      # specific path
/graphify <path> --update             # incremental update
/graphify query "how does X work?"    # query existing graph
/graphify path "ModuleA" "ModuleB"    # shortest path
/graphify explain "ConceptName"       # explain a node
```

## Fast Path - Existing Graph
**Before running pipeline:** Check if `graphify-out/graph.json` exists. If yes AND user asks natural language question (not rebuild command), skip straight to `graphify query "<question>"`. Graph already built - use it.

## Full Pipeline Steps

### 1. Ensure Installed
Check if graphify is installed. If not, install via pip or uv.

### 2. Run Graphify
```bash
graphify <path>
```
Generates:
- `graphify-out/graph.json` - knowledge graph data
- `graphify-out/graph.html` - interactive visualization
- `graphify-out/GRAPH_REPORT.md` - summary report

### 3. For Queries
After graph built:
```bash
graphify query "<question>"           # BFS traversal, broad context
graphify query "<question>" --dfs     # DFS, trace specific path
graphify path "NodeA" "NodeB"         # shortest path between concepts
graphify explain "NodeName"           # explain specific node
```

## When to Use
- User asks about codebase architecture
- "How does X work?"
- "What calls Y?"
- "Trace data flow"
- Understanding project structure
- Finding relationships between modules

## Output Files
- **graph.json** - Complete knowledge graph (nodes, edges, communities)
- **graph.html** - Interactive browser visualization (click nodes, filter, search)
- **GRAPH_REPORT.md** - Key concepts, surprising connections, suggested questions

## Workflow
1. Check if graph exists (`graphify-out/graph.json`)
2. If exists + user question → `graphify query "<question>"`
3. If not exists → `graphify <path>` to build graph first
4. After build → answer questions via queries
5. For updates → `graphify <path> --update`

## Integration
Used for codebase understanding, architecture questions, tracing relationships. Complements code review and debugging skills.

Graph persists across sessions - build once, query many times.
