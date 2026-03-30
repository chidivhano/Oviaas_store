$bytes = [System.IO.File]::ReadAllBytes('c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\assets\Oviaas_Coin.png')
$b64 = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText('c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\b64.txt', $b64)
