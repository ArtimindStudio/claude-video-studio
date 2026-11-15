Param(
  [switch]$Project,
  [string]$TargetDir = ""
)

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($Project) {
  $Root = if ($TargetDir) { (Resolve-Path $TargetDir).Path } else { (Get-Location).Path }
} else {
  $Root = $HOME
}

$SkillsDst = Join-Path $Root ".claude\skills"
$CmdsDst   = Join-Path $Root ".claude\commands"
New-Item -ItemType Directory -Force -Path $SkillsDst, $CmdsDst | Out-Null

Get-ChildItem -Path (Join-Path $RepoDir "skills") -Directory | ForEach-Object {
  $dest = Join-Path $SkillsDst $_.Name
  if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
  Copy-Item -Recurse -Force $_.FullName $dest
}

$LowpolyKit = Join-Path $SkillsDst "lowpoly-video\kit"
$PixelKit   = Join-Path $SkillsDst "pixel-video\kit"
New-Item -ItemType Directory -Force -Path $LowpolyKit, $PixelKit | Out-Null
Copy-Item -Recurse -Force (Join-Path $RepoDir "kit\*") $LowpolyKit
Copy-Item -Recurse -Force (Join-Path $RepoDir "kit\fonts") (Join-Path $PixelKit "fonts")
Copy-Item -Recurse -Force (Join-Path $RepoDir "kit\vendor") (Join-Path $PixelKit "vendor")

Copy-Item -Force (Join-Path $RepoDir "commands\*.md") $CmdsDst

Write-Host "Installed Claude Video Studio into $Root\.claude\"
Write-Host "  Skills:   video-studio, lowpoly-video, pixel-video, flat-video, animation-studio, real-sound, earshot"
Write-Host "  Commands: /video-studio, /lowpoly-video, /pixel-video, /flat-video, /whiteboard-video, /ukiyoe-video, /stickman-video, /doodle-video, /keynote-video, /watercolor-video, /clay-video, /chalkboard-video, /dankoe-video, /glowsketch-video, /comicart-video, /editorial-short, /sound-check"
