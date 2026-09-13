# ============================================================
# Misr Assistant — API Smoke Test (Categories)
# ============================================================
$Base = "http://127.0.0.1:8000/api/v1"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Write-Test {
    param([string]$Name)
    Write-Host "`n========== $Name ==========" -ForegroundColor Cyan
}

function Post-Json {
    param([string]$Url, [string]$Json)
    $tmp = "$env:TEMP\body.json"
    [System.IO.File]::WriteAllText($tmp, $Json, $utf8NoBom)
    $result = curl.exe -s -w "`nHTTP_STATUS: %{http_code}" -X POST $Url -H "Content-Type: application/json; charset=utf-8" --data-binary "@$tmp"
    Remove-Item $tmp -Force
    return $result
}

function Patch-Json {
    param([string]$Url, [string]$Json)
    $tmp = "$env:TEMP\body.json"
    [System.IO.File]::WriteAllText($tmp, $Json, $utf8NoBom)
    $result = curl.exe -s -w "`nHTTP_STATUS: %{http_code}" -X PATCH $Url -H "Content-Type: application/json; charset=utf-8" --data-binary "@$tmp"
    Remove-Item $tmp -Force
    return $result
}

function Delete-Url {
    param([string]$Url)
    return curl.exe -s -w "`nHTTP_STATUS: %{http_code}" -X DELETE $Url
}

function Get-Url {
    param([string]$Url)
    return curl.exe -s -w "`nHTTP_STATUS: %{http_code}" $Url
}

# ============================================================
# 0) نظّف أي category قديمة
# ============================================================
Write-Test "0) Cleanup"
$existing = curl.exe -s "$Base/categories"
Write-Host $existing

# ============================================================
# 1) Create - Arabic
# ============================================================
Write-Test "1) POST create national-id"
$json = '{"name":"الرقم القومي","slug":"national-id","description":"خدمات بطاقة الرقم القومي","icon":"id-card","sort_order":1,"is_active":true}'
$r = Post-Json "$Base/categories" $json
Write-Host $r

# ============================================================
# 2) Read by slug
# ============================================================
Write-Test "2) GET by slug"
$r = Get-Url "$Base/categories/slug/national-id"
Write-Host $r

# ============================================================
# 3) List
# ============================================================
Write-Test "3) GET list"
$r = Get-Url "$Base/categories"
Write-Host $r

# ============================================================
# 4) Patch
# ============================================================
Write-Test "4) PATCH update"
$json = '{"name":"بطاقة الرقم القومي","sort_order":5}'
$r = Patch-Json "$Base/categories/1" $json
Write-Host $r

# ============================================================
# 5) Conflict (409)
# ============================================================
Write-Test "5) POST conflict - 409 expected"
$json = '{"name":"Test","slug":"national-id"}'
$r = Post-Json "$Base/categories" $json
Write-Host $r

# ============================================================
# 6) Not found (404)
# ============================================================
Write-Test "6) GET 404"
$r = Get-Url "$Base/categories/9999"
Write-Host $r

# ============================================================
# 7) Delete (204)
# ============================================================
Write-Test "7) DELETE"
$r = Delete-Url "$Base/categories/1"
Write-Host $r

# ============================================================
# 8) List after delete (empty)
# ============================================================
Write-Test "8) GET list after delete"
$r = Get-Url "$Base/categories"
Write-Host $r

Write-Host "`n========== DONE ==========" -ForegroundColor Green