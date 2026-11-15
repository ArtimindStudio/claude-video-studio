# Claude Video Studio (Starter Lite) — Windows PowerShell Installer
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Install-StarterLite($DestSkills, $DestCommands) {
  New-Item -ItemType Directory -Force -Path $DestSkills | Out-Null
  $VsDest = Join-Path $DestSkills "video-studio"
  if (Test-Path $VsDest) { Remove-Item -Recurse -Force $VsDest }
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "skills\video-studio") $VsDest
  Copy-Item -Recurse -Force (Join-Path $RepoRoot "kit") (Join-Path $VsDest "kit")

  if ($DestCommands) {
    New-Item -ItemType Directory -Force -Path $DestCommands | Out-Null
    Copy-Item -Force (Join-Path $RepoRoot "commands\*.md") $DestCommands
  }
}

Write-Host "==> Installing Claude Video Studio (Starter Lite) into $HOME"
Install-StarterLite "$HOME\.claude\skills" "$HOME\.claude\commands"
Install-StarterLite "$HOME\.gemini\antigravity\skills" $null
Install-StarterLite "$HOME\.codex\skills" $null
Write-Host "Installed Starter Lite (/video-studio, /whiteboard-video). Full 17-command Pro Edition: https://aiartimind.com/claude-video-guide/"
