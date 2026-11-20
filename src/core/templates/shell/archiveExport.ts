/*
 * A zip archive written by hand: the entries are already-compressed PNGs, so they are
 * stored as they are. No library; the format is the local headers, the central directory
 * and one end record (UTF-8 names flagged), read back by the platform extractors.
 */

export type ArchiveEntry = { name: string; data: Uint8Array }

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
    let c = n
    for (let k = 0; k < 8; k += 1)
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
})

export function crc32(data: Uint8Array) {
    let c = 0xffffffff
    for (const byte of data) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
}

/** The bytes of a stored (uncompressed) zip archive of the given entries. */
export function createZip(entries: readonly ArchiveEntry[]): Uint8Array {
    const encoder = new TextEncoder()
    const parts: Uint8Array[] = []
    const central: Uint8Array[] = []
    let offset = 0
    for (const { name, data } of entries) {
        const nameBytes = encoder.encode(name)
        const crc = crc32(data)

        const local = new DataView(new ArrayBuffer(30))
        local.setUint32(0, 0x04034b50, true)
        local.setUint16(4, 20, true)
        local.setUint16(6, 0x0800, true)
        local.setUint32(14, crc, true)
        local.setUint32(18, data.length, true)
        local.setUint32(22, data.length, true)
        local.setUint16(26, nameBytes.length, true)
        parts.push(new Uint8Array(local.buffer), nameBytes, data)

        const entry = new DataView(new ArrayBuffer(46))
        entry.setUint32(0, 0x02014b50, true)
        entry.setUint16(4, 20, true)
        entry.setUint16(6, 20, true)
        entry.setUint16(8, 0x0800, true)
        entry.setUint32(16, crc, true)
        entry.setUint32(20, data.length, true)
        entry.setUint32(24, data.length, true)
        entry.setUint16(28, nameBytes.length, true)
        entry.setUint32(42, offset, true)
        central.push(new Uint8Array(entry.buffer), nameBytes)

        offset += 30 + nameBytes.length + data.length
    }
    const directorySize = central.reduce((sum, part) => sum + part.length, 0)
    const end = new DataView(new ArrayBuffer(22))
    end.setUint32(0, 0x06054b50, true)
    end.setUint16(8, entries.length, true)
    end.setUint16(10, entries.length, true)
    end.setUint32(12, directorySize, true)
    end.setUint32(16, offset, true)

    const all = [...parts, ...central, new Uint8Array(end.buffer)]
    const out = new Uint8Array(all.reduce((sum, part) => sum + part.length, 0))
    let at = 0
    for (const part of all) {
        out.set(part, at)
        at += part.length
    }
    return out
}

/** Saves a blob under the given file name. */
export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
}
