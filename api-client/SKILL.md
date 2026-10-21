---
name: api-client
description: API testing via curl. Test endpoint, format response, debug.
---

# API Client

## When to Use
- Test endpoint API
- Debug response error
- Verify API contract
- Need to call REST API dari terminal

## Process
1. Tentukan method: GET/POST/PUT/DELETE
2. Setup headers: auth, content-type
3. Kirim request: curl -X <method> <url> -H "<header>" -d '<body>'
4. Format response: pipe ke python -m json.tool
5. Cek status code: curl -s -o nul -w '%{http_code}'

## Don't Do
- Jangan simpan API key di command history
- Jangan kirim sensitive data tanpa HTTPS

## Integration
- github-cli, notion-mcp, google-calendar — semua API-based
