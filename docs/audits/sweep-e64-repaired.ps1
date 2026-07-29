# sweep-e64-repaired.ps1 — regression sweep E25-E69 in REPAIRED mode
$total = 0; $pass = 0; $fail = 0; $results = @()
for ($i = 25; $i -le 70; $i++) {
  $e = 'e' + $i
  $out = node docs/audits/$e-verify.js --repaired 2>&1
  $exit = $LASTEXITCODE
  $total++
  if ($exit -eq 0) { $pass++ } else { $fail++; $results += "$e FAIL`n$out" }
}
Write-Host "REPAIRED sweep E25-E70: total=$total pass=$pass fail=$fail"
if ($fail -gt 0) { $results | ForEach-Object { Write-Host $_ } }
exit $fail