$replacements = @(
    @{ From = 'الكورسات'; To = 'المواد' },
    @{ From = 'للكورسات'; To = 'للمواد' },
    @{ From = 'الكورس'; To = 'المادة' },
    @{ From = 'للكورس'; To = 'للمادة' },
    @{ From = 'كورسات'; To = 'مواد' },
    @{ From = 'كورس'; To = 'مادة' },
    @{ From = 'كورسك'; To = 'مادتك' },
    @{ From = '<title>.*?</title>'; To = '<title>مجمع طلاب BIS</title>' },
    @{ From = 'document\.title\s*=\s*`[^`]+`;'; To = 'document.title = "مجمع طلاب BIS";' }
)

$files = Get-ChildItem -Path "c:\Users\SAMA\Desktop\New folder" -Recurse -Include *.html, *.js -Exclude *node_modules*, *.min.js

foreach ($file in $files) {
    if ($file.FullName -match '\\assets\\' -or $file.FullName -match '\\css\\') {
        continue
    }
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content

    foreach ($rep in $replacements) {
        $content = [regex]::Replace($content, $rep.From, $rep.To)
    }

    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($file.FullName)"
    }
}
