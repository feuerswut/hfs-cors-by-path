exports.version = 1
exports.apiRequired = 1
exports.repo = "feuerswut/hfs-cors-by-path"
exports.description = "Allow CORS requests, filtered by path"

exports.init = () => ({
    middleware(ctx) {
        ctx.set('Access-Control-Allow-Methods', '*')
        ctx.set('Access-Control-Allow-Origin', '*')
        ctx.set('Access-Control-Allow-Headers', '*')
    }
})
