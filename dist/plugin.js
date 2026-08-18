// DEPRECATED: merged into security-suite (https://github.com/feuerswut/security-suite).
// This plugin will not receive further updates; only security-suite is maintained.

exports.version = 3
exports.apiRequired = 1
exports.repo = "feuerswut/hfs-cors-by-path"
exports.description = "Allow CORS requests, filtered by path"

exports.config = {
    header_deprecated: {
        type: 'show_html',
        html: '<div style="background:#402020;border:1px solid #a33;border-radius:6px;padding:10px 14px;margin-bottom:1em">'
            + '<strong>Deprecated</strong> &mdash; this plugin has been merged into '
            + '<a href="https://github.com/feuerswut/hfs-security-suite" target="_blank" rel="noopener">security-suite</a>. '
            + 'It will not receive further updates; only security-suite is maintained going forward.'
            + '</div>',
    },
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
            const origin = ctx.get('origin')
            let isExternal = false
            if (origin) {
                try { isExternal = new URL(origin).host !== ctx.host } catch (e) {}
            }
            const normalizedPath = require('path').posix.normalize(ctx.path)
            if (isExternal && pathMatches(normalizedPath, api.getConfig('paths'))) {
                ctx.set('Access-Control-Allow-Methods', '*')
                ctx.set('Access-Control-Allow-Origin', '*')
                ctx.set('Access-Control-Allow-Headers', '*')
            }
        }
    }
}
