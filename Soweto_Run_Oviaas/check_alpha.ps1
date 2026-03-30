Add-Type -AssemblyName System.Drawing
$filePath = 'c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\assets\Oviaas_Coin.png'
$img = [System.Drawing.Bitmap]::FromFile($filePath)

$minX = $img.Width; $minY = $img.Height; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $img.Height; $y += 10) {
    for ($x = 0; $x -lt $img.Width; $x += 10) {
        $pixel = $img.GetPixel($x, $y)
        if ($pixel.A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Output "Bounding Box: MinX=$minX, MinY=$minY, MaxX=$maxX, MaxY=$maxY"
$img.Dispose()
