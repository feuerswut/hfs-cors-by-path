exports.version = 1
exports.apiRequired = 1
exports.repo = "feuerswut/hfs-cors-by-path"
exports.description = "Allow CORS requests, filtered by path"

exports.config = {
    paths: {
        type: 'array',
        label: 'Path Filters (empty = allow all)',
        defaultValue: [],
        fields: {
            pattern: {
                type: 'string',
                label: 'Path prefix or regex pattern',
                $width: 4
            },
            isRegex: {
                type: 'boolean',
                label: 'Regex',
                defaultValue: false,
                $width: 1
            },
            enabled: {
                type: 'boolean',
                label: 'Enabled',
                defaultValue: true,
                $width: 1
            }
        }
    }
}

exports.init = api => {
    function pathMatches(requestPath, paths) {
        if (!paths || paths.length === 0) return true
        for (const entry of paths) {
            if (!entry.enabled || !entry.pattern) continue
            try {
                if (entry.isRegex) {
                    if (new RegExp(entry.pattern, 'i').test(requestPath)) return true
                } else {
                    const prefix = entry.pattern.endsWith('/') ? entry.pattern : entry.pattern + '/'
                    if (requestPath === entry.pattern ||
                        requestPath.startsWith(prefix)) return true
                }
            } catch (e) {}
        }
        return false
    }

    return {
        middleware(ctx) {
            const paths = api.getConfig('paths')
            if (!pathMatches(ctx.path, paths)) return
            ctx.set('Access-Control-Allow-Methods', '*')
            ctx.set('Access-Control-Allow-Origin', '*')
            ctx.set('Access-Control-Allow-Headers', '*')
        }
    }
}
