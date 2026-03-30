$html = Get-Content 'c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\index.html' -Raw
$b64 = Get-Content 'c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\b64.txt' -Raw
$target = "this.load.image('oviaas_coin', 'assets/Oviaas_Coin.png');"
$replacement = "this.load.image('oviaas_coin', `"data:image/png;base64,$b64`");"
$html = $html.Replace($target, $replacement)
[System.IO.File]::WriteAllText('c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\index.html', $html)
