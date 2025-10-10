# Simple PowerShell Script to Remove .html Extensions from HTML Files
param(
    [string]$ProjectPath = "h:\Alanove\visual studio\Micro Computers"
)

Write-Host "Starting Clean URL Conversion..." -ForegroundColor Green
Write-Host "Project Path: $ProjectPath" -ForegroundColor Cyan

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $ProjectPath -Recurse -Filter "*.html" | Where-Object {
    $_.FullName -notmatch "node_modules|vendor|\.git|backup"
}

Write-Host "Found $($htmlFiles.Count) HTML files to process..." -ForegroundColor Yellow

$totalUpdated = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor White
    
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Replace href patterns
        $content = $content -replace 'href="([^"]+)\.html"', 'href="$1"'
        $content = $content -replace "href='([^']+)\.html'", "href='`$1'"
        
        # Replace action patterns
        $content = $content -replace 'action="([^"]+)\.html"', 'action="$1"'
        $content = $content -replace "action='([^']+)\.html'", "action='`$1'"
        
        # Replace JavaScript location patterns
        $content = $content -replace 'location\.href\s*=\s*"([^"]+)\.html"', 'location.href = "$1"'
        $content = $content -replace "location\.href\s*=\s*'([^']+)\.html'", "location.href = '`$1'"
        
        # Replace window.location patterns
        $content = $content -replace 'window\.location\s*=\s*"([^"]+)\.html"', 'window.location = "$1"'
        $content = $content -replace "window\.location\s*=\s*'([^']+)\.html'", "window.location = '`$1'"
        
        # Save if changes were made
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $totalUpdated++
            Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  No changes: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Conversion completed!" -ForegroundColor Green
Write-Host "Files processed: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Files updated: $totalUpdated" -ForegroundColor White
Write-Host ""
Write-Host "Your URLs will now work without .html extensions!" -ForegroundColor Cyan