# Build the DeepSeek Harness Desktop runtime directory (resources/runtime):
#   node.exe + npm (bundled official Node LTS binaries)
#   full node_modules (proven dependency tree from the local npx cache)
#   package.json (entry point for one-click npm updates)
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts\prepare-runtime.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$runtime = Join-Path $root "runtime"
$npmCache = "C:\Users\fengq\AppData\Local\npm-cache\_npx\1e7f6d9597241db0"

$nodeVersion = "v24.14.1"
$nodeZipUrl = "https://npmmirror.com/mirrors/node/$nodeVersion/node-$nodeVersion-win-x64.zip"

Write-Host "==> runtime: $runtime"
New-Item -ItemType Directory -Force -Path $runtime | Out-Null

# ---------- 1. copy dependency tree (robocopy: fast and reliable) ----------
$srcModules = Join-Path $npmCache "node_modules"
$dstModules = Join-Path $runtime "node_modules"
if (-not (Test-Path $dstModules)) {
    Write-Host "==> copying node_modules ($srcModules -> $dstModules) ..."
    robocopy $srcModules $dstModules /E /MT:16 /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }
    Write-Host "    copied."
} else {
    Write-Host "==> node_modules already exists, skipping copy."
}

# ---------- 2. prune cross-platform prebuilds (keep win32-x64 only) ----------
$pruneTargets = @(
    "node-pty\prebuilds\darwin-arm64",
    "node-pty\prebuilds\darwin-x64",
    "node-pty\prebuilds\linux-arm64",
    "node-pty\prebuilds\linux-x64",
    "node-pty\prebuilds\win32-arm64"
)
foreach ($t in $pruneTargets) {
    $p = Join-Path $dstModules $t
    if (Test-Path $p) { Remove-Item -Recurse -Force $p; Write-Host "    pruned $t" }
}

# ---------- 3. download and extract official Node binaries ----------
$nodeExe = Join-Path $runtime "node.exe"
if (-not (Test-Path $nodeExe)) {
    $zip = Join-Path $env:TEMP "node-$nodeVersion-win-x64.zip"
    if (-not (Test-Path $zip)) {
        Write-Host "==> downloading Node $nodeVersion ..."
        Invoke-WebRequest -Uri $nodeZipUrl -OutFile $zip -UseBasicParsing
    }
    Write-Host "==> extracting Node ..."
    $extract = Join-Path $env:TEMP "node-$nodeVersion-win-x64"
    if (Test-Path $extract) { Remove-Item -Recurse -Force $extract }
    tar -xf $zip -C $env:TEMP
    Copy-Item (Join-Path $extract "node.exe") $nodeExe -Force
    Copy-Item (Join-Path $extract "npm.cmd") (Join-Path $runtime "npm.cmd") -Force
    Copy-Item (Join-Path $extract "npx.cmd") (Join-Path $runtime "npx.cmd") -Force
    Copy-Item (Join-Path $extract "node_modules\npm") (Join-Path $runtime "node_modules\npm") -Recurse -Force
    Write-Host "    node.exe ready."
} else {
    Write-Host "==> node.exe already exists."
}

# ---------- 4. write runtime package.json (update entry) ----------
$manifestPath = Join-Path $runtime "package.json"
if (-not (Test-Path $manifestPath)) {
    $json = @'
{
  "name": "dsh-desktop-runtime",
  "private": true,
  "version": "1.0.0",
  "description": "DeepSeek Harness Desktop runtime (bundled Node + deps, npm update entry)",
  "dependencies": {
    "@deepseek-ai/dsh": "0.1.0-rc.7"
  }
}
'@
    Set-Content $manifestPath $json -Encoding ASCII
    Write-Host "==> runtime/package.json written."
}

# ---------- 5. verify ----------
$check = @{
    "node.exe"                  = Join-Path $runtime "node.exe"
    "npm-cli.js"                = Join-Path $runtime "node_modules\npm\bin\npm-cli.js"
    "dsh bin.js"                = Join-Path $runtime "node_modules\@deepseek-ai\dsh\lib\bin.js"
    "dsh-web-frontend dist"     = Join-Path $runtime "node_modules\@deepseek-ai\dsh-web-frontend\dist\index.html"
    "semver"                    = Join-Path $runtime "node_modules\semver"
    "node-pty win32-x64"        = Join-Path $runtime "node_modules\node-pty\prebuilds\win32-x64"
}
$failed = $false
foreach ($k in $check.Keys) {
    $ok = Test-Path $check[$k]
    if (-not $ok) { $failed = $true }
    Write-Host ("    [{0}] {1}" -f $(if ($ok) { "OK" } else { "MISSING" }), $k)
}
if ($failed) { throw "runtime verification failed" }

$ver = & $runtime\node.exe --version
Write-Host "==> bundled node: $ver"
Write-Host "==> runtime ready at $runtime"
