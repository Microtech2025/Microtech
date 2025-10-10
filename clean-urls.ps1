# PowerShell Script to Remove .html Extensions from All HTML Files
# This script will update all HTML files to use clean URLs

param(
    [string]$ProjectPath = "h:\Alanove\visual studio\Micro Computers"
)

Write-Host "🔧 Starting Clean URL Conversion..." -ForegroundColor Cyan
Write-Host "📁 Project Path: $ProjectPath" -ForegroundColor Green

# Get all HTML files in the project
$htmlFiles = Get-ChildItem -Path $ProjectPath -Recurse -Filter "*.html" | Where-Object {
    # Exclude certain directories that might contain templates or vendor files
    $_.FullName -notmatch "node_modules|vendor|\.git|backup"
}

Write-Host "📄 Found $($htmlFiles.Count) HTML files to process..." -ForegroundColor Green

$totalUpdated = 0
$filesWithChanges = @()

foreach ($file in $htmlFiles) {
    Write-Host "🔍 Processing: $($file.Name)" -ForegroundColor Yellow
    
    # Read file content
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Common patterns to replace .html extensions
        $patterns = @(
            # href attributes
            'href="([^"]*?)\.html"',
            "href='([^']*?)\.html'",
            
            # src attributes (less common but sometimes used)
            'src="([^"]*?)\.html"',
            "src='([^']*?)\.html'",
            
            # JavaScript redirects and assignments
            'location\.href\s*=\s*["'']([^"'']*?)\.html["'']',
            'window\.location\s*=\s*["'']([^"'']*?)\.html["'']',
            'window\.open\s*\(\s*["'']([^"'']*?)\.html["'']',
            
            # Form actions
            'action="([^"]*?)\.html"',
            "action='([^']*?)\.html'"
        )
        
        $changesMade = $false
        
        foreach ($pattern in $patterns) {
            $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            
            if ($matches.Count -gt 0) {
                Write-Host "  ✅ Found $($matches.Count) matches for pattern: $pattern" -ForegroundColor Green
                
                foreach ($match in $matches) {
                    $fullMatch = $match.Value
                    $urlPart = $match.Groups[1].Value
                    
                    # Skip external URLs, emails, and special cases
                    if (($urlPart -notmatch "^(https?://|mailto:|tel:|#|javascript:)") -and 
                        ($urlPart -ne "") -and 
                        ($urlPart -notmatch "\.(css|js|png|jpg|jpeg|gif|pdf|doc|docx)$")) {
                        
                        # Replace the .html extension
                        $newMatch = $fullMatch -replace "\.html", ""
                        $content = $content.Replace($fullMatch, $newMatch)
                        $changesMade = $true
                        
                        Write-Host "    🔄 $fullMatch → $newMatch" -ForegroundColor Cyan
                    }
                }
            }
        }
        
        # Special case: Update canonical URLs if they exist
        $canonicalPattern = '<link\s+rel="canonical"\s+href="([^"]*?)\.html"'
        if ($content -match $canonicalPattern) {
            $content = $content -replace $canonicalPattern, '<link rel="canonical" href="$1"'
            $changesMade = $true
            Write-Host "  🔗 Updated canonical URL" -ForegroundColor Green
        }
        
        # Save file if changes were made
        if ($changesMade) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $totalUpdated++
            $filesWithChanges += $file.Name
            Write-Host "  💾 Updated: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  ⏭️  No changes needed: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Clean URL conversion completed!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  • Total files processed: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "  • Files updated: $totalUpdated" -ForegroundColor White
Write-Host "  • Files unchanged: $($htmlFiles.Count - $totalUpdated)" -ForegroundColor White

if ($filesWithChanges.Count -gt 0) {
    Write-Host ""
    Write-Host "📝 Files that were updated:" -ForegroundColor Cyan
    foreach ($fileName in $filesWithChanges) {
        Write-Host "  • $fileName" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "🌐 Your URLs will now work without .html extensions!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test your website with the new clean URLs" -ForegroundColor White
Write-Host "  2. Update any external links or bookmarks" -ForegroundColor White
Write-Host "  3. Consider setting up 301 redirects for SEO" -ForegroundColor White
Write-Host ""
Write-Host "Example URL changes:" -ForegroundColor Yellow
Write-Host "  Before: https://yoursite.com/staff.html" -ForegroundColor Red
Write-Host "  After:  https://yoursite.com/staff" -ForegroundColor Green