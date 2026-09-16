import console from 'node:console'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'

const distDirectory = resolve('dist')
const host = process.env.IP || '::'
const port = Number(process.env.PORT || 8103)

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
}

function getFilePath(pathname) {
    const requestedPath = pathname === '/' ? '/index.html' : pathname
    const filePath = resolve(distDirectory, `.${requestedPath}`)

    if (
        filePath !== distDirectory &&
        !filePath.startsWith(`${distDirectory}${sep}`)
    ) {
        return null
    }

    return filePath
}

function sendFile(response, filePath) {
    const extension = extname(filePath)
    response.writeHead(200, {
        'content-type': mimeTypes[extension] || 'application/octet-stream',
    })
    createReadStream(filePath).pipe(response)
}

const server = createServer((request, response) => {
    try {
        const url = new URL(
            request.url || '/',
            `http://${request.headers.host}`
        )
        const filePath = getFilePath(decodeURIComponent(url.pathname))

        if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
            sendFile(response, filePath)
            return
        }

        if (!extname(url.pathname)) {
            sendFile(response, resolve(distDirectory, 'index.html'))
            return
        }

        response.writeHead(404).end('Not found')
    } catch {
        response.writeHead(400).end('Bad request')
    }
})

server.listen(port, host, () => {
    console.log(`Lantern is listening on http://${host}:${port}`)
})
