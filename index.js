const path = require("path");

const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");
const toolCache = require("@actions/tool-cache");

function findArchive({version, nodePlatform}) {
    const wasmtimePlatform = nodePlatformToWasmtimePlatform(nodePlatform);
    const extension = nodePlatform === "win32" ? "zip" : "tar.xz";
    const directoryName = `wasmtime-v${version}-x86_64-${wasmtimePlatform}`;

    return [directoryName, `https://github.com/bytecodealliance/wasmtime/releases/download/v${version}/${directoryName}.${extension}`]
}

function nodePlatformToWasmtimePlatform(nodePlatform) {
    switch (nodePlatform) {
        case "darwin":
            return "macos";
        case "linux":
            return "linux";
        case "win32":
            return "windows";
        default:
            throw new Error("unrecognised platform: " + nodePlatform);
    }
}

async function install() {
    try {
        const version = core.getInput("wasmtime-version");
        const nodePlatform = process.platform;
        const [archiveDirectory, archiveUrl] = findArchive({version, nodePlatform});
        core.info(`Download from ${archiveUrl}`);
        const archivePath = await toolCache.downloadTool(archiveUrl);
        const tempDir = nodePlatform === "win32"
            ? await toolCache.extractZip(archivePath)
            : await toolCache.extractTar(archivePath, undefined, "xJ");
        const toolPath = await toolCache.cacheDir(path.join(tempDir, archiveDirectory), "wasmtime", version);
        core.addPath(toolPath);
    } catch (error) {
        core.setFailed(error.message);
    }
}

install();

